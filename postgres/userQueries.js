
const pool = require("./postgres");


// returns all users from users table
// errors: could not retrieve users --> 500 internal server error
const getAllUsers = async () => {
    const client = await pool.connect();
  
    try {
      const { rows } = await client.query(`select * from users LIMIT 10`);
  
      return rows;
    } catch (error) {
      console.log(error);
      res.status(500).send("Could not retrieve users.")
    } finally {
        client.release();
    }
  };

// get specific user by id
// errors: could not make query -> 500 internal server error
const getUserById = async (userId) => {
    const client = await pool.connect();
    try {
        const {rows} = await client.query(`select * from users WHERE id = $1`, [userId]);
        

        return rows;
    
    } catch (error) {
        console.log(error);
        res.status(500).send("error in querying users table for id: " + userId);
    } finally {
        client.release();
    }
};

// add user to users table
// user args assumed to be correct
// RETURN: added user details
// errors: could not add new user --> 500 internal server error
const addNewUser = async (user) => {
    
    const { username, password, email, fname, lname, dob } = user;
    const client = await pool.connect();

    try {
        
        const {rows} = await client.query(`INSERT INTO users 
        (username, password, email, first_name, last_name, date_of_birth)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `, [username, password, email, fname, lname, dob]);


        return rows
    } catch (error) {
        console.log(error);
        res.status(500).send("could not add new user");
        return;
    } finally {
        client.release();
    }

};

module.exports = { getAllUsers, getUserById, addNewUser };