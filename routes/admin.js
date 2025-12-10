const express = require('express');
const router = express.Router();
const { pool } = require('../server');
const { authenticateAdmin } = require('../middleware/auth');

// Get all orders from all users
router.get('/orders', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object(
        'name', oi.item_name,
        'price', oi.item_price,
        'quantity', oi.quantity
      )) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );

    // Returned all orders with their items
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status during order processing
router.patch('/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'preparing', 'ready', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const completedAt = status === 'completed' ? new Date() : null;

    const result = await pool.query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP, completed_at = $2
       WHERE id = $3
       RETURNING *`,
      [status, completedAt, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Order status updated and done',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order, try again' });
  }
});

// Get dashboard statistics for admin view
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT 
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'preparing' THEN 1 END) as preparing,
        COUNT(CASE WHEN status = 'ready' THEN 1 END) as ready,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(*) as total,
        SUM(total) as revenue
      FROM orders
    `);

    const stats = statsResult.rows[0];

    res.json({
      pending: parseInt(stats.pending) || 0,
      preparing: parseInt(stats.preparing) || 0,
      ready: parseInt(stats.ready) || 0,
      completed: parseInt(stats.completed) || 0,
      total: parseInt(stats.total) || 0,
      revenue: parseFloat(stats.revenue) || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
