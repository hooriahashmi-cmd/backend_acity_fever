
## Step 4: Database Schema Details

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  room_number VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Menu Items Table
```sql
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(500),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_code VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(10, 2),
  delivery_fee DECIMAL(10, 2),
  total DECIMAL(10, 2),
  user_email VARCHAR(255),
  user_room VARCHAR(50),
  user_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER,
  item_name VARCHAR(255) NOT NULL,
  item_price DECIMAL(10, 2),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Admin Users Table
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Step 5: Common Database Queries

Here are some common queries used in the application:

### User Management
```sql
-- Create a new user
INSERT INTO users (email, name, password, room_number)
VALUES ('user@example.com', 'John Doe', 'hashed_password', 'Room 101');

-- Get user by email
SELECT * FROM users WHERE email = 'user@example.com';

-- Update user information
UPDATE users SET name = 'Jane Doe', updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Menu Management
```sql
-- Add a new menu item
INSERT INTO menu_items (name, description, price, category, image_url)
VALUES ('Burger', 'Delicious beef burger', 15.99, 'Main Course', '/assets/burger.jpg');

-- Get all available menu items
SELECT * FROM menu_items WHERE is_available = TRUE;

-- Update menu item price
UPDATE menu_items SET price = 16.99, updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Order Management
```sql
-- Create a new order
INSERT INTO orders (order_code, user_id, subtotal, delivery_fee, total, user_email, user_room, user_name)
VALUES ('ORD001', 1, 31.98, 2.00, 33.98, 'user@example.com', 'Room 101', 'John Doe');

-- Add items to order
INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity)
VALUES (1, 1, 'Burger', 15.99, 2);

-- Get orders for a user
SELECT * FROM orders WHERE user_id = 1 ORDER BY created_at DESC;

-- Update order status
UPDATE orders SET status = 'completed', completed_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Admin Operations
```sql
-- Create admin user
INSERT INTO admin_users (username, password, email)
VALUES ('admin', 'hashed_password', 'admin@example.com');

-- Get all orders with user details
SELECT o.*, u.name, u.room_number
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;
```


```bash
# In the backend directory
node -e "require('dotenv').config(); const { Pool } = require('pg'); const pool = new Pool({ user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME }); pool.query('SELECT NOW()', (err, res) => { if(err) console.error(err); else console.log('Connection successful:', res.rows[0]); pool.end(); });"
```

