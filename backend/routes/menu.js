module.exports = (pool) => {
  const router = require('express').Router();
  
 
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM menu_items WHERE is_available = true ORDER BY category, name'
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ error: error.message });
    }
  });
  

  router.post('/', async (req, res) => {
    try {
      const { name, description, price, category, image_url } = req.body;
      const result = await pool.query(
        'INSERT INTO menu_items (name, description, price, category, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, price, category, image_url]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating menu item:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  return router;
};