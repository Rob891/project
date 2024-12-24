const User = require("../DOA/UsersDOA");
const { v4: uuidv4 } = require('uuid');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users", details: err.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user", details: err.message });
  }
};

exports.createUser = async (req, res) => {
  const { email, password, username } = req.body;
  console.log("Creating new user...");
  
  try {
    const user_id = uuidv4();
    const password_hash = password; 
    console.log(`User creation attempt with ID: ${user_id}, Email: ${email}, Username: ${username}`);

    const newUser = await User.create({ user_id, email, password_hash, username });
    console.log(`User created successfully with ID: ${newUser.user_id}`);
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).json({ error: "Failed to create user", details: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, username } = req.body;
  try {
    const password_hash = password || undefined;
    const updatedUser = await User.update(id, { email, password_hash, username });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user", details: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.delete(id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user", details: err.message });
  }
};

exports.loginUser = async (req, res) => {
  console.log("Login attempt initiated...");
  const { identifier, password } = req.body;
  
  try {
    console.log(`Attempting to find user with identifier: ${identifier}`);
    const user = await User.getByEmailOrUsername(identifier);
    
    if (!user) {
      console.warn(`User not found with identifier: ${identifier}`);
      return res.status(401).json({ error: "Invalid email/username or password" });
    }
    
    console.log(`User found: ${user.user_id}. Verifying password...`);
    if (user.password_hash !== password) {
      console.warn(`Password mismatch for user: ${user.user_id}`);
      return res.status(401).json({ error: "Invalid email/username or password" });
    }
    
    console.log(`Login successful for user: ${user.user_id}`);
    res.json({
      message: "Login successful",
      user: { user_id: user.user_id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error("Error logging in user:", err.message);
    res.status(500).json({ error: "Failed to login user", details: err.message });
  }
};
