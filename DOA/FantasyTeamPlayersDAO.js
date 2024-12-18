const pool = require('../db');

const FantasyTeamPlayers = {
  // Add a player to the fantasy team
  addPlayer: async ({ fantasy_team_id, player_id, is_captain = false, points = 0, gameweek }) => {
    const result = await pool.query(
      `INSERT INTO FantasyTeamPlayers (fantasy_team_id, player_id, is_captain, points, gameweek)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [fantasy_team_id, player_id, is_captain, points, gameweek]
    );
    return result.rows[0];
  },

  // Get all players in a fantasy team for a specific gameweek
  getPlayersByTeamAndGameweek: async (fantasy_team_id, gameweek) => {
    const result = await pool.query(
      `SELECT * FROM FantasyTeamPlayers 
       WHERE fantasy_team_id = $1 AND gameweek = $2`,
      [fantasy_team_id, gameweek]
    );
    return result.rows;
  },

  // Remove a player from the fantasy team
  removePlayer: async (fantasy_team_id, player_id, gameweek) => {
    const result = await pool.query(
      `DELETE FROM FantasyTeamPlayers 
       WHERE fantasy_team_id = $1 AND player_id = $2 AND gameweek = $3 
       RETURNING *`,
      [fantasy_team_id, player_id, gameweek]
    );
    return result.rows[0];
  },

  setCaptain: async (fantasy_team_id, player_id, gameweek) => {
    await pool.query(
      `UPDATE FantasyTeamPlayers 
       SET is_captain = FALSE 
       WHERE fantasy_team_id = $1 AND gameweek = $2`,
      [fantasy_team_id, gameweek]
    );

    const result = await pool.query(
      `UPDATE FantasyTeamPlayers 
       SET is_captain = TRUE 
       WHERE fantasy_team_id = $1 AND player_id = $2 AND gameweek = $3
       RETURNING *`,
      [fantasy_team_id, player_id, gameweek]
    );
    return result.rows[0];
  },
};

module.exports = FantasyTeamPlayers;
