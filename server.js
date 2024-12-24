

const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Assuming this is your database connection pool


const app = express();

// Use CORS middleware
app.use(cors());


app.use(express.json()); // Middleware to parse JSON

app.use("/users", require("./routes/UserRoutes"));


// Function to check if a user exists
const checkUserExists = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result;
};

// Route to handle sign-up
app.post("/signup", async (req, res) => {
  app.use(cors());



  const { email, username, password } = req.body;

  try {
    // Check if the user exists
    const userExists = await checkUserExists(email);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Insert the new user
    await pool.query(
      "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)",
      [email, username, password]
    );

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ message: "Server error" });
  }

});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
