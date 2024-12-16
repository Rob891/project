const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");

router.get("/", userController.getAllUsers);

router.get("/:id", userController.getUserById);

router.post("/register", userController.createUser);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

router.post("/login", userController.loginUser);

module.exports = router;
