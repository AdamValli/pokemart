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
    res.status(500).send("Could not retrieve users.");
  } finally {
    client.release();
  }
};

// get specific user by id
// errors: could not make query -> 500 internal server error
const getUserById = async (userId) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`select * from users WHERE id = $1`, [
      userId,
    ]);

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
    const { rows } = await client.query(
      `INSERT INTO users 
        (username, password, email, first_name, last_name, date_of_birth)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING id, username;
        `,
      [username, password, email, fname, lname, dob]
    );

    return rows;
  } catch (error) {
    console.log(error);
    res.status(500).send("could not add new user");
    return;
  } finally {
    client.release();
  }
};

// update user in users table
// args: updates expected to be populated with one of more of {username, password, email, fname, lname, dob}
// errors: could not update user --> 500 internal server error
// could not find user to update --> 404 Not Found
const updateUserById = async (updates, userId) => {
  const client = await pool.connect();
  const parsedUpdates = parseUpdates(updates);

  try {
    await client.query("BEGIN");

    // update users set {updates.key} = {updates.value} where id = {userId}
  } catch (error) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

// return updates object with key-values suitable for db
const parseUpdates = (updates) => {
  const newUpdates = {};

  for (let i in updates) {
    let key = i;
    let value = updates[i];

    if (key === "fname") key = "first_name";
    if (key === "lname") key = "last_name";
    if (key === "dob") key = "date_of_birth";

    newUpdates[key] = value;
  }

  return newUpdates;
};

module.exports = { getAllUsers, getUserById, addNewUser };
