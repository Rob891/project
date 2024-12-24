const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://fantasyleaguedb:hikE2GNspqac7R4mySeswkwgBdjCfGb9@dpg-cthedg5umphs73fndri0-a/project1_8zox",
  ssl: {
    rejectUnauthorized: false, 
  },
});

module.exports = pool;
