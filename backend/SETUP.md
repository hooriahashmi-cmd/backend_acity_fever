# BACKEND SETUP GUIDE

## Prerequisites
- Node.js 18+ (https://nodejs.org/)
- PostgreSQL 12+ (https://www.postgresql.org/)
- Git

## Local Development Setup

### 1. Install PostgreSQL
Download and install PostgreSQL from https://www.postgresql.org/download/

During installation, remember:
- Username: `postgres`
- Password: (set your own)
- Port: 5432 (default)

### 2. Create Database
Open pgAdmin or psql terminal and run:
```sql
CREATE DATABASE bistro_db;
```

### 3. Clone/Setup Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# DB_PASSWORD=your_postgres_password
```

### 4. Initialize Database Tables
```bash
# Run this in Node environment to create tables
node -e "require('./config/database').initializeDatabase()"
```

### 5. Insert Sample Menu Items
```sql
INSERT INTO menu_items (name, description, price, category, image_url) VALUES
('Classic Burger', 'Juicy beef patty with lettuce, tomato, and special sauce', 25.00, 'lunch', 'burgerss.jpg'),
('Jollof Rice & Chicken', 'Spicy Ghanaian jollof with grilled chicken', 30.00, 'lunch', 'jolllof.jpg'),
('Waakye Special', 'Rice and beans with spaghetti, gari, and protein', 20.00, 'breakfast', 'waakye.jpg'),
('Fried Rice', 'Mixed vegetables with chicken and shrimp', 28.00, 'dinner', 'fried-rice.webp'),
('Banku & Tilapia', 'Traditional fermented corn dough with grilled tilapia', 35.00, 'dinner', 'tilapia.jpg'),
('Pizza Margherita', 'Fresh mozzarella, tomato sauce, and basil', 40.00, 'lunch', 'pizza.jpg'),
('Fufu & Light Soup', 'Pounded cassava with goat meat light soup', 32.00, 'dinner', 'fufu.jpg'),
('Chicken Shawarma', 'Grilled chicken wrap with veggies and sauce', 22.00, 'lunch', 'shawarma.webp'),
('Kelewele', 'Spicy fried plantain chips', 15.00, 'lunch', 'kenkey.jpeg'),
('Cake & Ice Cream', 'Fresh cake slice with vanilla ice cream', 18.00, 'desserts', 'cake.jpg'),
('Fresh Orange Juice', 'Freshly squeezed orange juice', 8.00, 'drinks', 'orange.jpg'),
('Sobolo Drink', 'Traditional hibiscus flower drink', 6.00, 'drinks', 'sobolo.jpg');
```

### 6. Run Development Server
```bash
npm run dev
```

Server will run on http://localhost:5000

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/admin-login` - Admin login

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get items by category
- `GET /api/menu/:id` - Get single menu item

### Orders (Requires authentication)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order

### Admin (Requires admin authentication)
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/stats` - Get dashboard statistics

## Testing with cURL or Postman

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123",
    "room_number": "A101"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Menu
```bash
curl http://localhost:5000/api/menu
```

### Create Order (use token from login)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      {"name": "Classic Burger", "price": 25.00, "quantity": 1}
    ],
    "subtotal": 25.00,
    "deliveryFee": 5.00,
    "total": 30.00,
    "userRoom": "A101"
  }'
```

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify credentials in .env
- Ensure database `bistro_db` exists

### Port Already in Use
```bash
# Change PORT in .env or kill process on port 5000
```

### Missing Dependencies
```bash
npm install
```
