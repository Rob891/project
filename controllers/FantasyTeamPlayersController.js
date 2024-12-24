const FantasyTeamPlayers = require("../DOA/FantasyTeamPlayersDAO");

// Add a player to the fantasy team
exports.addPlayerToTeam = async (req, res) => {
  const { fantasy_team_id, player_id, gameweek, is_captain = false, points = 0 } = req.body;

  try {
    const newPlayer = await FantasyTeamPlayers.addPlayer({
      fantasy_team_id,
      player_id,
      is_captain,
      points,
      gameweek,
    });

    res.status(201).json({
      message: "Player added to the fantasy team successfully",
      player: newPlayer,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to add player to the team",
      details: err.message,
    });
  }
};

exports.getPlayersByTeamAndGameweek = async (req, res) => {
  const { fantasy_team_id, gameweek } = req.params;

  try {
    const players = await FantasyTeamPlayers.getPlayersByTeamAndGameweek(fantasy_team_id, gameweek);

    res.json({
      message: "Players fetched successfully",
      players,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch players for the team",
      details: err.message,
    });
  }
};

exports.removePlayerFromTeam = async (req, res) => {
  const { fantasy_team_id, player_id, gameweek } = req.body;

  try {
    const removedPlayer = await FantasyTeamPlayers.removePlayer(fantasy_team_id, player_id, gameweek);

    if (!removedPlayer) {
      return res.status(404).json({ error: "Player not found in the team" });
    }

    res.json({
      message: "Player removed from the team successfully",
      player: removedPlayer,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to remove player from the team",
      details: err.message,
    });
  }
};

exports.setCaptain = async (req, res) => {
  const { fantasy_team_id, player_id, gameweek } = req.body;

  try {
    const updatedCaptain = await FantasyTeamPlayers.setCaptain(fantasy_team_id, player_id, gameweek);

    res.json({
      message: "Captain updated successfully",
      player: updatedCaptain,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to set captain",
      details: err.message,
    });
  }
};

console.log(req.body);
console.error("Fetch error details:", err);

