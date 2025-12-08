// const { pool } = require('../server');

// // Initialize Database Tables
// async function initializeDatabase() {
//   try {
//     // Users table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         name VARCHAR(255) NOT NULL,
//         password VARCHAR(255) NOT NULL,
//         room_number VARCHAR(50) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // Menu items table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS menu_items (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         description TEXT,
//         price DECIMAL(10, 2) NOT NULL,
//         category VARCHAR(50) NOT NULL,
//         image_url VARCHAR(500),
//         is_available BOOLEAN DEFAULT TRUE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // Orders table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS orders (
//         id SERIAL PRIMARY KEY,
//         order_code VARCHAR(50) UNIQUE NOT NULL,
//         user_id INTEGER REFERENCES users(id),
//         status VARCHAR(50) DEFAULT 'pending',
//         subtotal DECIMAL(10, 2),
//         delivery_fee DECIMAL(10, 2),
//         total DECIMAL(10, 2),
//         user_email VARCHAR(255),
//         user_room VARCHAR(50),
//         user_name VARCHAR(255),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         completed_at TIMESTAMP
//       );
//     `);

//     // Order items table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS order_items (
//         id SERIAL PRIMARY KEY,
//         order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
//         menu_item_id INTEGER,
//         item_name VARCHAR(255) NOT NULL,
//         item_price DECIMAL(10, 2),
//         quantity INTEGER NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // Admin users table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS admin_users (
//         id SERIAL PRIMARY KEY,
//         username VARCHAR(100) UNIQUE NOT NULL,
//         password VARCHAR(255) NOT NULL,
//         email VARCHAR(255),
//         role VARCHAR(50) DEFAULT 'admin',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     console.log('Database tables initialized successfully');
//   } catch (error) {
//     console.error('Error initializing database:', error);
//     process.exit(1);
//   }
// }

// module.exports = { initializeDatabase };
const { Pool } = require("pg")

const pool = new Pool({
    connectionString: "postgresql://bistro_31tj_user:YUaMVYwdTmUpu0rBT7kWOuC2Ri3tteyt@dpg-d4ralamr433s738kqrd0-a.virginia-postgres.render.com/bistro_31tjs",
    ssl: {
        require: true,
        rejectUnauthorized: false,   
    }
})

pool.on("connect", () => {
    console.log("Connected to Postgres Database")
})
module.exports = pool;