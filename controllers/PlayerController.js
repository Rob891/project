const Player = require("../DOA/PlayersDAO");
const FPLService = require("../fplservice");
const { v4: uuidv4 } = require('uuid');

exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.getAll();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch players", details: err.message });
  }
};

exports.getPlayerById = async (req, res) => {
  const { id } = req.params;
  try {

    const player = await Player.getById(id);
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.json(player);
  } catch (err) {

    res.status(500).json({ error: "Failed to fetch player", details: err.message });
    
  }
};

exports.createPlayer = async (req, res) => {
  const { name, position, team_id, nationality, price } = req.body;
  try {
    const player_id = uuidv4();
    const newPlayer = await Player.create({
      player_id,
      name,
      position,
      team_id,
      nationality,
      price,
    });
    res.status(201).json({ message: "Player created successfully", player: newPlayer });
  } catch (err) {
    res.status(500).json({ error: "Failed to create player", details: err.message });
  }
};

exports.updatePlayer = async (req, res) => {
  const { id } = req.params;
  const { name, position, team_id, nationality, price, total_points } = req.body;

  try {
    const updatedPlayer = await Player.update(id, {
      name,
      position,
      team_id,
      nationality,
      price,
      total_points,
    });

    if (!updatedPlayer) return res.status(404).json({ error: "Player not found" });

    res.json({ message: "Player updated successfully", player: updatedPlayer });
  } catch (err) {
    res.status(500).json({ error: "Failed to update player", details: err.message });
  }
};

exports.deletePlayer = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPlayer = await Player.delete(id);
    if (!deletedPlayer) return res.status(404).json({ error: "Player not found" });
    res.json({ message: "Player deleted successfully", player: deletedPlayer });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete player", details: err.message });
  }
};

exports.syncPlayers = async (req, res) => {
  try {
    const playersData = await FPLService.fetchPlayers();
    await Player.upsertPlayers(playersData);
    res.status(200).json({ message: "Players synced successfully from FPL API!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to sync players from FPL API", details: err.message });
  }
};

const db = require("../db"); // Replace with your database connection setup

exports.getPlayersByTeam = async (req, res) => {
  const { team_id } = req.params;

  try {
    const query = "SELECT * FROM players WHERE team_id = $1";
    const values = [team_id];

    const result = await db.query(query, values);
    res.json(result.rows); // Send fetched players to the frontend
  } catch (err) {
    console.error("Error fetching players by team:", err);
    res.status(500).json({ error: "Failed to fetch players for the team." });
  }
};

