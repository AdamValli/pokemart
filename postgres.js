const Pool = require("pg").Pool;

const pool = new Pool({
  username: "adamv",
  password: "123",
  host: "localhost",
  port: 5432,
  database: "pokemart",
});

// test query
const getAllUsers = async () => {
  const client = await pool.connect();

  try {
    const { rows } = await client.query(`select * from users LIMIT 10`);

    client.release();
    return rows;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};



module.exports = { getAllUsers }
