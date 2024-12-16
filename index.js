const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/UserRoutes"); // Import user routes

const app = express();
app.use(cors());
app.use(express.json());

// Use user routes
app.use("/users", userRoutes);

// Root route
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

// Start the server
app.listen(5001, () => console.log("Server is running on http://localhost:5001"));
