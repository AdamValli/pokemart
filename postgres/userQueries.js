
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

// get specific user by id
const getUserById = async (userId) => {
    const client = await pool.connect();
    try {
        const {rows} = await client.query(`select * from users WHERE id = $1`, [userId]);
        
        client.release();

        return rows;
    
    } catch (error) {
        console.log(error);
        throw new Error("error in querying users table for id: " + userId);
    }
};
  

module.exports = { getAllUsers, getUserById };