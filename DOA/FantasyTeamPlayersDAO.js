const pool = require('../db');

const FantasyTeamPlayers = {
  // Add a player to the fantasy team or update existing entry
  addPlayer: async ({ fantasy_team_id, player_id, is_captain = false, points = 0 }) => {
    try {
      const result = await pool.query(
        `INSERT INTO FantasyTeamPlayers (fantasy_team_id, player_id, is_captain, points)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (fantasy_team_id, player_id) DO UPDATE 
         SET points = EXCLUDED.points, is_captain = EXCLUDED.is_captain
         RETURNING *`,
        [fantasy_team_id, player_id, is_captain, points]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error adding/updating player in fantasy team:", error);
      throw new Error("Failed to add or update player in fantasy team.");
    }
  },

  // Get all players in a fantasy team
  getPlayersByTeam: async (fantasy_team_id) => {
    try {
      const result = await pool.query(
        `SELECT * FROM FantasyTeamPlayers 
         WHERE fantasy_team_id = $1`,
        [fantasy_team_id]
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching players for fantasy team:", error);
      throw new Error("Failed to retrieve players for the specified fantasy team.");
    }
  },

  // Remove a player from the fantasy team
  removePlayer: async (fantasy_team_id, player_id) => {
    try {
      const result = await pool.query(
        `DELETE FROM FantasyTeamPlayers 
         WHERE fantasy_team_id = $1 AND player_id = $2 
         RETURNING *`,
        [fantasy_team_id, player_id]
      );
      if (result.rows.length === 0) {
        throw new Error("Player not found in the fantasy team.");
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error removing player from fantasy team:", error);
      throw new Error("Failed to remove player from the fantasy team.");
    }
  },

  // Set a captain for the fantasy team
  setCaptain: async (fantasy_team_id, player_id) => {
    try {
      // Ensure only one captain per team
      await pool.query(
        `UPDATE FantasyTeamPlayers 
         SET is_captain = FALSE 
         WHERE fantasy_team_id = $1`,
        [fantasy_team_id]
      );

      const result = await pool.query(
        `UPDATE FantasyTeamPlayers 
         SET is_captain = TRUE 
         WHERE fantasy_team_id = $1 AND player_id = $2
         RETURNING *`,
        [fantasy_team_id, player_id]
      );

      if (result.rows.length === 0) {
        throw new Error("Player not found or unable to set as captain.");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error setting captain for fantasy team:", error);
      throw new Error("Failed to set captain for the fantasy team.");
    }
  },

  // Get the captain of a fantasy team
  getCaptain: async (fantasy_team_id) => {
    try {
      const result = await pool.query(
        `SELECT * FROM FantasyTeamPlayers 
         WHERE fantasy_team_id = $1 AND is_captain = TRUE`,
        [fantasy_team_id]
      );

      if (result.rows.length === 0) {
        throw new Error("No captain found for the specified fantasy team.");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error retrieving captain for fantasy team:", error);
      throw new Error("Failed to retrieve captain for the fantasy team.");
    }
  },
};

module.exports = FantasyTeamPlayers;
