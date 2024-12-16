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

// exports.createUser = async (req, res) => {
//   const { user_id, email, password, username } = req.body;
//   try {
//     // Without bcrypt, we directly store the password as-is
//     const password_hash = password; // Plain text password (not secure!)

//     const newUser = await User.create({ user_id, email, password_hash, username });
//     res.status(201).json({ message: "User created successfully", user: newUser });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create user", details: err.message });
//   }
// };
// exports.createUser = async (req, res) => {
//     const { user_id, email, password, username } = req.body;
//     try {
//       console.log("Received registration request:", { user_id, email, username });
//       const password_hash = password; // Plain-text password (for now)
  
//       const newUser = await User.create({ user_id, email, password_hash, username });
//       console.log("User created successfully:", newUser);
//       res.status(201).json({ message: "User created successfully", user: newUser });
//     } catch (err) {
//       console.error("Error during user creation:", err.message);
//       res.status(500).json({ error: "Failed to create user", details: err.message });
//     }
//   };


exports.createUser = async (req, res) => {
  const { email, password, username } = req.body; // Remove user_id from the request body
  try {
    const user_id = uuidv4(); // Generate a new UUID
    console.log("Received registration request:", { user_id, email, username });

    const password_hash = password; // Use bcrypt if needed for hashing

    const newUser = await User.create({ user_id, email, password_hash, username });
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Error during user creation:", err.message);
    res.status(500).json({ error: "Failed to create user", details: err.message });
  }
};

  

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, username } = req.body;

  try {
    // Without bcrypt, just use password directly
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

// exports.loginUser = async (req, res) => {
//   const { identifier, password } = req.body;

//   try {
//     const user = await User.getByEmailOrUsername(identifier);
//     if (!user) {
//       return res.status(401).json({ error: "Invalid email/username or password" });
//     }

//     // Without bcrypt, just compare plain-text
//     if (user.password_hash !== password) {
//       return res.status(401).json({ error: "Invalid email/username or password" });
//     }

//     res.json({
//       message: "Login successful",
//       user: { user_id: user.user_id, email: user.email, username: user.username },
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to login user", details: err.message });
//   }
// };



exports.loginUser = async (req, res) => {
    const { identifier, password } = req.body;
  
    try {
      // Log the incoming request body
      console.log("reached");
      console.log("Login request received with:", { identifier, password });
  
      // Fetch user from the database
      const user = await User.getByEmailOrUsername(identifier);
      console.log("User fetched from database:", user);
  
      if (!user) {
        console.log("No user found with identifier:", identifier);
        return res.status(401).json({ error: "Invalid email/username or password" });
      }
  
      // Compare passwords (assuming plain-text for now)
      console.log("Comparing passwords:", {
        providedPassword: password,
        storedPassword: user.password_hash,
      });
  
      if (user.password_hash !== password) {
        console.log("Password mismatch for user:", identifier);
        return res.status(401).json({ error: "Invalid email/username or password" });
      }
  
      // Successful login
      console.log("Login successful for user:", {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
      });
  
      res.json({
        message: "Login successful",
        user: { user_id: user.user_id, email: user.email, username: user.username },
      });
    } catch (err) {
      // Log the error stack trace
      console.error("Error during login process:", err.stack);
      res.status(500).json({ error: "Failed to login user", details: err.message });
    }
  };
  
