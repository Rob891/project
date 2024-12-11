const express = require("express");
const cors = require("cors");
const {Pool} = require("pg");


const app = express ()
app.use(cors())
app.use(express.json())


const pool = new Pool({
    user: 'fantasyleaguedb',
    host: 'localhost',
    database: 'fantasyleaguedb',
    port: 5432
})

module.exports = pool;

app.get("/", (req, res) => {
    res.send("Welcome to the Fantasy League API!");
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ message: "Database connected!", serverTime: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ error: "Database connection failed", details: err.message });
    }
});


app.listen(5001, () => console.log('Server is running on http://localhost:5001'))