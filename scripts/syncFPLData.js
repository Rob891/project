const { v4: uuidv4 } = require("uuid");
const FPLService = require("../fplservice");
const pool = require("../db");

// Function to sync teams with generated UUIDs and FPL IDs
const syncTeams = async (teams) => {
  const teamIdMap = new Map();
  console.log("Syncing teams...");

  for (const team of teams) {
    try {
      const teamUUID = uuidv4();

      // Insert or ignore if team already exists (based on fpl_team_id)
      const result = await pool.query(
        `INSERT INTO teams (team_id, fpl_team_id, team_name, stadium)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (fpl_team_id) DO UPDATE
         SET team_name = EXCLUDED.team_name
         RETURNING team_id`,
        [teamUUID, team.id, team.name, `Stadium of ${team.name}`]
      );

      const insertedTeamId = result.rows[0].team_id;
      teamIdMap.set(team.id, insertedTeamId); // Map FPL team.id to team_id (UUID)
      console.log(`Team added/updated: ${team.name} with UUID: ${insertedTeamId}`);
    } catch (err) {
      console.error(`Error adding/updating team: ${team.name}`, err.message);
    }
  }

  return teamIdMap; // Return the mapping of FPL IDs to UUIDs
};

// Function to sync players with correct team mapping
const syncPlayers = async (players, teamIdMap) => {
  console.log("Syncing players...");

  for (const player of players) {
    try {
      const playerUUID = uuidv4();
      const teamUUID = teamIdMap.get(player.team);

      if (!teamUUID) {
        console.error(`Skipping player ${player.first_name} ${player.second_name} due to missing team mapping.`);
        continue;
      }

      // Insert player, update total_points and fpl_player_id if player already exists
      await pool.query(
        `INSERT INTO players (player_id, fpl_player_id, name, position, team_id, nationality, price, total_points)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (fpl_player_id) DO UPDATE
         SET total_points = EXCLUDED.total_points,
             name = EXCLUDED.name,
             position = EXCLUDED.position,
             team_id = EXCLUDED.team_id,
             price = EXCLUDED.price`,
        [
          playerUUID,
          player.id, // FPL player ID from API
          `${player.first_name} ${player.second_name}`,
          player.element_type, // Position type (1 = GK, 2 = DEF, etc.)
          teamUUID, // Mapped team UUID
          "Unknown", // FPL API does not provide nationality
          player.now_cost / 10, // Convert price to a float
          player.total_points,
        ]
      );
      console.log(`Player added/updated: ${player.first_name} ${player.second_name} with UUID: ${playerUUID}`);
    } catch (err) {
      console.error(
        `Error adding/updating player: ${player.first_name} ${player.second_name}`,
        err.message
      );
    }
  }
};

// Main function to fetch FPL data and sync teams and players
const syncFPLData = async () => {
  try {
    console.log("Fetching FPL data...");
    const teams = await FPLService.fetchTeams(); // Fetch teams
    const players = await FPLService.fetchPlayers(); // Fetch players

    const teamIdMap = await syncTeams(teams); // Sync teams and get team mapping
    await syncPlayers(players, teamIdMap); // Sync players using team mapping

    console.log("FPL data sync completed successfully!");
  } catch (err) {
    console.error("Error syncing FPL data:", err.message);
  } finally {
    pool.end(); // Close the database connection
  }
};

syncFPLData();
