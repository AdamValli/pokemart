const pool = require("./postgres");

const makeQuery = async (query) => {
  const client = await pool.connect();
  try {
    const results = await client.query(query);
    console.log("---------- Make Query ----------");
    console.log(results.rows);
    console.log("--------------------------------")
    return results.rows;
  } catch (error) {
    console.log(error);
    return;
  } finally {
    client.release();
  }
};

module.exports = { makeQuery };
