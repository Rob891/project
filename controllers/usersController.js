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
  try {
    const user_id = uuidv4();
    const password_hash = password;
    const newUser = await User.create({ user_id, email, password_hash, username });
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
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
  const { identifier, password } = req.body;
  try {
    const user = await User.getByEmailOrUsername(identifier);
    if (!user || user.password_hash !== password) {
      return res.status(401).json({ error: "Invalid email/username or password" });
    }
    res.json({
      message: "Login successful",
      user: { user_id: user.user_id, email: user.email, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to login user", details: err.message });
  }
};
