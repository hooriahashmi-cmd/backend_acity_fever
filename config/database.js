const { Pool } = require("pg")


const pool = new Pool({
    connectionString: "postgresql://bistro_31tj_user:YUaMVYwdTmUpu0rBT7kWOuC2Ri3tteyt@dpg-d4ralamr433s738kqrd0-a.virginia-postgres.render.com/bistro_31tj",
    
    ssl: {
        require: true,
        rejectUnauthorized: false,
    }
})

pool.on("connect", () => {
    console.log(" Connected to Postgres Database")
})

// Test the connection on startup
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error(" Database connection test failed:", err.message)
    } else {
        console.log(" Database connection test successful! Server time:", res.rows[0].now)
    }
})

module.exports = pool;