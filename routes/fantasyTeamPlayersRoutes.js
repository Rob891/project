const express = require("express");
const router = express.Router();
const FantasyTeamPlayersController = require("../controllers/FantasyTeamPlayersController");

router.post("/add", FantasyTeamPlayersController.addPlayerToTeam);

router.get("/:fantasy_team_id/:gameweek", FantasyTeamPlayersController.getPlayersByTeamAndGameweek);

router.delete("/remove", FantasyTeamPlayersController.removePlayerFromTeam);

router.put("/set-captain", FantasyTeamPlayersController.setCaptain);

module.exports = router;
