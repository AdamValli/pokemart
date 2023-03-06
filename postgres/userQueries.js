
const pool = require("./postgres");


// returns all users from users table
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

  

module.exports = { getAllUsers };