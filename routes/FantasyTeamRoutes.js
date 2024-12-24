const express = require("express");
const router = express.Router();
const FantasyTeamsController = require("../controllers/FantasyTeamsController");

router.post("/", FantasyTeamsController.createFantasyTeam);

router.get("/user/:user_id", FantasyTeamsController.getFantasyTeamsByUser);
router.get("/user/:user_id/team-id", FantasyTeamsController.getFantasyTeamIdByUserId);

router.delete("/:fantasy_team_id", FantasyTeamsController.deleteFantasyTeam);

module.exports = router;
