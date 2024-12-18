const pool = require('../db');

const FantasyTeams = {
  create: async ({ fantasy_team_id, user_id, team_name, budget }) => {
    const result = await pool.query(
      `INSERT INTO FantasyTeams (fantasy_team_id, user_id, team_name, budget)
       VALUES ($1, $2, $3, $4)
       RETURNING fantasy_team_id, user_id, team_name, total_points, budget`,
      [fantasy_team_id, user_id, team_name, budget]
    );
    return result.rows[0];
  },

  getByUserId: async (user_id) => {
    const result = await pool.query(
      `SELECT * FROM FantasyTeams WHERE user_id = $1`,
      [user_id]
    );
    return result.rows;
  },

  getById: async (fantasy_team_id) => {
    const result = await pool.query(
      `SELECT * FROM FantasyTeams WHERE fantasy_team_id = $1`,
      [fantasy_team_id]
    );
    return result.rows[0];
  },

  update: async (fantasy_team_id, { total_points, budget }) => {
    const result = await pool.query(
      `UPDATE FantasyTeams
       SET total_points = COALESCE($2, total_points),
           budget = COALESCE($3, budget)
       WHERE fantasy_team_id = $1
       RETURNING fantasy_team_id, user_id, team_name, total_points, budget`,
      [fantasy_team_id, total_points, budget]
    );
    return result.rows[0];
  },

  delete: async (fantasy_team_id) => {
    const result = await pool.query(
      `DELETE FROM FantasyTeams WHERE fantasy_team_id = $1 RETURNING fantasy_team_id, team_name`,
      [fantasy_team_id]
    );
    return result.rows[0];
  }
};

module.exports = FantasyTeams;
