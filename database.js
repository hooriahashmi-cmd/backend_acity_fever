const { Pool } = require("pg")

// Created a new pool instance to manage connections
const pool = new Pool({
    connectionString: "postgresql://bistro_31tj_user:YUaMVYwdTmUpu0rBT7kWOuC2Ri3tteyt@dpg-d4ralamr433s738kqrd0-a.virginia-postgres.render.com/bistro_31tj",
    
    ssl: {
        require: true,
        rejectUnauthorized: false,
    }
})

// Log connection status
pool.on("connect", () => {
    console.log(" Connected to Postgres Database...")
})

// Test the connection on startup from code in class
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error(" Database connection test failed...", err.message)
    } else {
        console.log(" Database connection test successful.  Server time:", res.rows[0].now)
    }
})

module.exports = pool;