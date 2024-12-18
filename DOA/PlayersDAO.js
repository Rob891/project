const pool = require('../db');

const Player = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT player_id, name, position, team_id, nationality, price, total_points
      FROM players
    `);
    return result.rows;
  },

  getById: async (player_id) => {
    const result = await pool.query(`
      SELECT player_id, name, position, team_id, nationality, price, total_points
      FROM players
      WHERE player_id = $1
    `, [player_id]);
    return result.rows[0];
  },

  create: async ({ player_id, name, position, team_id, nationality, price }) => {
    const result = await pool.query(`
      INSERT INTO players (player_id, name, position, team_id, nationality, price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING player_id, name, position, team_id, nationality, price, total_points
    `, [player_id, name, position, team_id, nationality, price]);
    return result.rows[0];
  },

  update: async (player_id, { name, position, team_id, nationality, price, total_points }) => {
    const result = await pool.query(`
      UPDATE players
      SET name = COALESCE($2, name),
          position = COALESCE($3, position),
          team_id = COALESCE($4, team_id),
          nationality = COALESCE($5, nationality),
          price = COALESCE($6, price),
          total_points = COALESCE($7, total_points)
      WHERE player_id = $1
      RETURNING player_id, name, position, team_id, nationality, price, total_points
    `, [player_id, name, position, team_id, nationality, price, total_points]);
    return result.rows[0];
  },

  delete: async (player_id) => {
    const result = await pool.query(`
      DELETE FROM players
      WHERE player_id = $1
      RETURNING player_id, name
    `, [player_id]);
    return result.rows[0];
  },

  upsertPlayers: async (playersData) => {
    const query = `
      INSERT INTO players (player_id, name, position, team_id, nationality, price, total_points)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (player_id)
      DO UPDATE SET
        name = EXCLUDED.name,
        position = EXCLUDED.position,
        team_id = EXCLUDED.team_id,
        nationality = EXCLUDED.nationality,
        price = EXCLUDED.price,
        total_points = EXCLUDED.total_points;
    `;

    for (const player of playersData) {
      const {
        id,
        web_name,
        element_type,
        team,
        now_cost,
        total_points,
      } = player;

      await pool.query(query, [
        id,
        web_name,
        element_type,
        team,
        "Unknown",
        now_cost / 10,
        total_points,
      ]);
    }
  },
};

module.exports = Player;
