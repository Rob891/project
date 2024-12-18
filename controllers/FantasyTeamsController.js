const FantasyTeams = require("../DOA/FantasyTeamsDAO");
const { v4: uuidv4 } = require("uuid");

exports.createFantasyTeam = async (req, res) => {
  const { user_id, team_name } = req.body;

  try {
    const existingTeams = await FantasyTeams.getByUserId(user_id);

    if (existingTeams.length > 0) {
      return res.status(400).json({
        error: "User already has a fantasy team",
        team: existingTeams[0],
      });
    }

    // Generate a new UUID for the fantasy team
    const fantasy_team_id = uuidv4();
    const budget = 100.0; // Default budget

    const newTeam = await FantasyTeams.create({
      fantasy_team_id,
      user_id,
      team_name,
      budget,
    });

    res.status(201).json({
      message: "Fantasy team created successfully",
      team: newTeam,
    });
  } catch (err) {
    console.error("Error creating fantasy team:", err.message);
    res
      .status(500)
      .json({ error: "Failed to create fantasy team", details: err.message });
  }
};

exports.getFantasyTeamsByUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const teams = await FantasyTeams.getByUserId(user_id);

    if (teams.length === 0) {
      return res.status(404).json({ message: "No fantasy teams found for this user" });
    }

    res.json(teams);
  } catch (err) {
    console.error("Error fetching fantasy teams:", err.message);
    res.status(500).json({
      error: "Failed to fetch fantasy teams",
      details: err.message,
    });
  }
};

exports.getFantasyTeamIdByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const fantasy_team_id = await FantasyTeams.getFantasyTeamIdByUserId(user_id);

    if (!fantasy_team_id) {
      return res.status(404).json({ message: "No fantasy team found for this user" });
    }

    res.json({ fantasy_team_id });
  } catch (err) {
    console.error("Error fetching fantasy team ID:", err.message);
    res.status(500).json({
      error: "Failed to fetch fantasy team ID",
      details: err.message,
    });
  }
};

exports.deleteFantasyTeam = async (req, res) => {
  const { fantasy_team_id } = req.params;

  try {
    const deletedTeam = await FantasyTeams.delete(fantasy_team_id);

    if (!deletedTeam) {
      return res.status(404).json({ error: "Fantasy team not found" });
    }

    res.json({
      message: "Fantasy team deleted successfully",
      team: deletedTeam,
    });
  } catch (err) {
    console.error("Error deleting fantasy team:", err.message);
    res.status(500).json({
      error: "Failed to delete fantasy team",
      details: err.message,
    });
  }
};
