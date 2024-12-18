const express = require("express");
const router = express.Router();
const FantasyTeamsController = require("../controllers/FantasyTeamsController");

// Route to create a fantasy team
router.post("/", FantasyTeamsController.createFantasyTeam);

// Route to get all fantasy teams for a user
router.get("/user/:user_id", FantasyTeamsController.getFantasyTeamsByUser);

// Route to delete a fantasy team
router.delete("/:fantasy_team_id", FantasyTeamsController.deleteFantasyTeam);

module.exports = router;
