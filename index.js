const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/UserRoutes"); // Import user routes
const playersRoutes = require('./routes/PlayersRoutes');
const fantasyTeamsRoutes = require("./routes/FantasyTeamRoutes");
const fantasyTeamPlayersRoutes = require("./routes/fantasyTeamPlayersRoutes");
const fplRoutes = require("./routes/fplroutes"); 


const app = express();
app.use(cors());
app.use(express.json());

// Use user routes
app.use("/users", userRoutes);
app.use('/players', playersRoutes);
app.use('/fantasy-team', fantasyTeamsRoutes);
app.use("/fantasy-team-players", fantasyTeamPlayersRoutes);
app.use("/api/fpl", fplRoutes);



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
