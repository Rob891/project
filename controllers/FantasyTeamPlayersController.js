const FantasyTeamPlayers = require('../DOA/FantasyTeamPlayersDAO');

const FantasyTeamPlayersController = {
  addPlayer: async (req, res) => {
    const { fantasy_team_id, player_id, is_captain = false, points = 0 } = req.body;

    try {
      const player = await FantasyTeamPlayers.addPlayer({
        fantasy_team_id,
        player_id,
        is_captain,
        points,
      });
      res.status(201).json({
        message: "Player successfully added to the fantasy team.",
        data: player,
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to add player to fantasy team.",
        details: err.message,
      });
    }
  },

  getPlayersByTeam: async (req, res) => {
    const { fantasy_team_id } = req.params;

    try {
      const players = await FantasyTeamPlayers.getPlayersByTeam(fantasy_team_id);
      res.status(200).json({
        message: "Players retrieved successfully.",
        data: players,
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to retrieve players for the fantasy team.",
        details: err.message,
      });
    }
  },

  removePlayer: async (req, res) => {
    const { fantasy_team_id, player_id } = req.params;

    try {
      const player = await FantasyTeamPlayers.removePlayer(fantasy_team_id, player_id);
      if (!player) {
        return res.status(404).json({
          error: "Player not found in the fantasy team.",
        });
      }
      res.status(200).json({
        message: "Player removed from the fantasy team successfully.",
        data: player,
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to remove player from fantasy team.",
        details: err.message,
      });
    }
  },

  setCaptain: async (req, res) => {
    const { fantasy_team_id, player_id } = req.body;

    try {
      const captain = await FantasyTeamPlayers.setCaptain(fantasy_team_id, player_id);
      res.status(200).json({
        message: "Captain set successfully.",
        data: captain,
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to set captain for the fantasy team.",
        details: err.message,
      });
    }
  },

  getCaptain: async (req, res) => {
    const { fantasy_team_id } = req.params;

    try {
      const captain = await FantasyTeamPlayers.getCaptain(fantasy_team_id);
      if (!captain) {
        return res.status(404).json({
          error: "No captain found for the fantasy team.",
        });
      }
      res.status(200).json({
        message: "Captain retrieved successfully.",
        data: captain,
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to retrieve captain for the fantasy team.",
        details: err.message,
      });
    }
  },
};

module.exports = FantasyTeamPlayersController;
