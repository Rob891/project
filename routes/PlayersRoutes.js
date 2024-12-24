const express = require("express");
const router = express.Router();
const playersController = require("../controllers/PlayerController");

// Get all players
router.get("/", playersController.getAllPlayers);

router.get("/:id", playersController.getPlayerById);

router.post("/", playersController.createPlayer);

router.put("/:id", playersController.updatePlayer);

router.delete("/:id", playersController.deletePlayer);

router.post("/sync", playersController.syncPlayers);

// get by team ID for team selection
router.get("/team/:team_id", playersController.getPlayersByTeam);


module.exports = router;
