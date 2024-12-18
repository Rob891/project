const express = require("express");
const router = express.Router();
const FantasyTeamPlayersController = require("../controllers/FantasyTeamPlayersController");

// Add a player to the fantasy team
router.post("/add", FantasyTeamPlayersController.addPlayer);

// Get all players in a fantasy team
router.get("/:fantasy_team_id", FantasyTeamPlayersController.getPlayersByTeam);

// Remove a player from the fantasy team
router.delete("/:fantasy_team_id/:player_id", FantasyTeamPlayersController.removePlayer);

// Set a captain for the fantasy team
router.put("/set-captain", FantasyTeamPlayersController.setCaptain);

// Get the captain of a fantasy team
router.get("/:fantasy_team_id/captain", FantasyTeamPlayersController.getCaptain);


module.exports = router;
