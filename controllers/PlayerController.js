const Player = require("../DOA/PlayersDAO");
const FPLService = require("../fplservice");
const { v4: uuidv4 } = require('uuid');

exports.getAllPlayers = async (req, res) => {
  try {
    console.log("Xxx")
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

exports.getPlayerIdByName = async (req, res) => {
  const { name } = req.params;

  try {
    const player = await Player.getByName(name);
    if (!player) return res.status(404).json({ error: "Player not found" });

    res.json({ player_id: player.player_id });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch player ID", details: err.message });
  }
};

// New method to get players with photos and database player IDs
exports.getPlayersWithPhotos = async (req, res) => {
    try {
      console.log("Fetching all players from the database...");
      const dbPlayers = await Player.getAll();
      console.log(`Fetched ${dbPlayers.length} players from the database.`);
  
      console.log("Fetching players from the FPL API...");
      const fplPlayers = await FPLService.fetchPlayers();
      console.log(`Fetched ${fplPlayers.length} players from the FPL API.`);
  
      console.log("Creating FPL player photo map...");
      const fplPlayerPhotos = new Map(
        fplPlayers.map((fplPlayer) => [
          `${fplPlayer.first_name} ${fplPlayer.second_name}`,
          `https://resources.premierleague.com/premierleague/photos/players/110x140/p${fplPlayer.code}.png`,
        ])
      );
      console.log(`FPL photo map created with ${fplPlayerPhotos.size} entries.`);
  
      console.log("Mapping database players to include FPL photos...");
      const playersWithPhotos = dbPlayers.map((dbPlayer) => {
        const photo = fplPlayerPhotos.get(dbPlayer.name) || null;
        if (!photo) {
          console.warn(`Photo not found for player: ${dbPlayer.name}`);
        }
        return {
          player_id: dbPlayer.player_id,
          name: dbPlayer.name,
          position: dbPlayer.position,
          team_id: dbPlayer.team_id,
          nationality: dbPlayer.nationality,
          price: dbPlayer.price,
          total_points: dbPlayer.total_points,
          photo: photo,
        };
      });
  
      console.log(`Successfully mapped ${playersWithPhotos.length} players with photos.`);
      res.json(playersWithPhotos);
    } catch (err) {
      console.error("Error occurred while fetching players with photos:", err.message);
      res.status(500).json({ error: "Failed to fetch players with photos", details: err.message });
    }
  };
  
