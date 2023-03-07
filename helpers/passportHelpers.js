// for passport init

const { getUserByUsername, getUserById } = require("../postgres/userQueries");
const { printDebug } = require("./debugHelpers");

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


// args: user object straight from authUser fn above
const serializeUser = (user, done) => {
  printDebug("Serializing User", user);

  return done(null, user.id);
};

const deserializeUser = async (id, done) => {
  try {
    
    const found = await getUserById(id);

    // could not find user error
    if(found[0].length < 1){
      throw new Error("User with id " + id + " not found");
    }

    const user = {
      user: {
        id: found[0].id,
        username: found[0].username
      },
      data: {
        user: {
          email: found[0].email,
          fname: found[0].first_name,
          lname: found[0].last_name,
          dob: found[0].date_of_birth
        }
      }
    }

    printDebug("Deserialzing User To: ", user);
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }

};

module.exports = { authUser, serializeUser, deserializeUser };
