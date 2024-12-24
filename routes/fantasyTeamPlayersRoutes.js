const express = require("express");
const router = express.Router();
const FantasyTeamPlayersController = require("../controllers/FantasyTeamPlayersController");

router.post("/add", FantasyTeamPlayersController.addPlayer);

router.get("/:fantasy_team_id", FantasyTeamPlayersController.getPlayersByTeam);

router.delete("/:fantasy_team_id/:player_id", FantasyTeamPlayersController.removePlayer);

router.put("/set-captain", FantasyTeamPlayersController.setCaptain);

router.get("/:fantasy_team_id/captain", FantasyTeamPlayersController.getCaptain);


module.exports = router;
