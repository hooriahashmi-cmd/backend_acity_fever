const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');


router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, subtotal, deliveryFee, total, userRoom } = req.body;
    const user = req.user;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order items required' });
    }

    const orderCode = 'ORD' + Date.now();


    const orderResult = await pool.query(
      `INSERT INTO orders 
       (order_code, user_id, subtotal, delivery_fee, total, user_email, user_room, user_name, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
       RETURNING *`,
      [orderCode, user.id, subtotal, deliveryFee, total, user.email, userRoom, user.name]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items 
         (order_id, item_name, item_price, quantity)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.name, item.price, item.quantity]
      );
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        code: order.order_code,
        status: order.status,
        total: order.total,
        createdAt: order.created_at
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});


router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object(
        'name', oi.item_name,
        'price', oi.item_price,
        'quantity', oi.quantity
      )) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});


router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object(
        'name', oi.item_name,
        'price', oi.item_price,
        'quantity', oi.quantity
      )) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id`,
      [id, user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
