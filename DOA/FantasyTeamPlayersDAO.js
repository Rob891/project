const pool = require('../db');

const FantasyTeamPlayers = {
  // Add a player to the fantasy team
  addPlayer: async ({ fantasy_team_id, player_id, is_captain = false, points = 0 }) => {
    const result = await pool.query(
      `INSERT INTO FantasyTeamPlayers (fantasy_team_id, player_id, is_captain, points)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (fantasy_team_id, player_id) DO UPDATE 
       SET points = EXCLUDED.points, is_captain = EXCLUDED.is_captain
       RETURNING *`,
      [fantasy_team_id, player_id, is_captain, points]
    );
    return result.rows[0];
  },

  // Get all players in a fantasy team
  getPlayersByTeam: async (fantasy_team_id) => {
    const result = await pool.query(
      `SELECT * FROM FantasyTeamPlayers 
       WHERE fantasy_team_id = $1`,
      [fantasy_team_id]
    );
    return result.rows;
  },

  // Remove a player from the fantasy team
  removePlayer: async (fantasy_team_id, player_id) => {
    const result = await pool.query(
      `DELETE FROM FantasyTeamPlayers 
       WHERE fantasy_team_id = $1 AND player_id = $2 
       RETURNING *`,
      [fantasy_team_id, player_id]
    );
    return result.rows[0];
  },

  // Set a captain for the fantasy team
  setCaptain: async (fantasy_team_id, player_id) => {
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
    return result.rows[0];
  },

  // Get the captain of a fantasy team
  getCaptain: async (fantasy_team_id) => {
    const result = await pool.query(
      `SELECT * FROM FantasyTeamPlayers 
       WHERE fantasy_team_id = $1 AND is_captain = TRUE`,
      [fantasy_team_id]
    );
    return result.rows[0];
  },
};

module.exports = FantasyTeamPlayers;
