const { Pool } = require("pg");

const pool = new Pool({
  user: 'fantasyleaguedb',
  host: 'localhost',
  database: 'fantasyleaguedb',
  port: 5432,
});

module.exports = pool;
