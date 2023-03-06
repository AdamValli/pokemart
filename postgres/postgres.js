const Pool = require("pg").Pool;

const pool = new Pool({
  username: "adamv",
  password: "123",
  host: "localhost",
  port: 5432,
  database: "pokemart",
});




module.exports = pool;
