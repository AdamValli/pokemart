// for passport init

const { getUserByUsername, getUserById, addNewUser } = require("../postgres/userQueries");
const { printDebug } = require("./debugHelpers");
const bcrypt = require("bcrypt");

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

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
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

const registerUser = async (req, username, password, done) => {
  try {
    // check if user exists
    const foundUsername = await getUserByUsername(username);

    if (foundUsername.length > 0) {
      throw new Error("Username already exists.");
    }
    // FOR EMAIL SIGN UP FUNCTIONALITY
    // const foundEmail = await getUserByEmail(email);

    // if(foundEmail.length > 0){
    //     throw new Error("Account with this email already exists.");
    // }

    // check username is correct format
    if (username.trim().includes(" ")) {
      throw new Error("Username incorrect formatting. Includes whitespace.");
    }

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    const encrypted = await bcrypt.hash(password, salt);

    const user = {
      username: username.trim().toLowerCase(),
      password: encrypted,
      email: "noemail2",
      first_name: "null",
      last_name: "null",
      date_of_birth: "01-01-1990"
    };

    // add user to db
    const results = await addNewUser(user);

    // save user local
    done(null, {id: results[0].id, username: user.username, password: user.password})
  } catch (error) {
    done(error, false);
  }
};

// args: user object straight from authUser fn (login) or registerUser (signUp) above
const serializeUser = (user, done) => {
  printDebug("Serializing User", user);

  return done(null, user.id);
};

const deserializeUser = async (id, done) => {
  try {
    const found = await getUserById(id);

    // could not find user error
    if (found[0].length < 1) {
      throw new Error("User with id " + id + " not found");
    }

    const user = {
      user: {
        id: found[0].id,
        username: found[0].username,
      },
      data: {
        user: {
          email: found[0].email,
          fname: found[0].first_name,
          lname: found[0].last_name,
          dob: found[0].date_of_birth,
        },
      },
    };

    printDebug("Deserialzing User To: ", user);
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

module.exports = { authUser, serializeUser, deserializeUser, registerUser };
