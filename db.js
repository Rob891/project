const { Pool } = require("pg");

const pool = new Pool({
  user: 'fantasyleaguedb',
  host: 'localhost',
  database: 'fantasyleaguedb',
  password: 'Supreme27',
  port: 5432
});

module.exports = pool;
