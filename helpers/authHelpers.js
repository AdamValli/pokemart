// for passport init

const { getUserByUsername } = require("../postgres/userQueries");

// looks up db and authenticates user
const authUser = async (username, password, done) => {
  try {
    // find user
    const found = await getUserByUsername(username);

    // failed
    if (found.length < 1) {
      throw new Error(`User ${username} not found`);
    }

    const user = { ...found[0] };

    // authenticate user
    if (user.password !== password) {
      // ADD BCRYPT
      throw new Error("Password incorrect");
    }

    // success
    return done(null, { id: user.id, username: user.username });
  } catch (error) {
    // error
    console.log(error);
    return done(error, false);
  }
};

module.exports = { authUser };
