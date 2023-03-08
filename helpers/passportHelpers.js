// for passport init

const { getUserByUsername, getUserById, addNewUser } = require("../postgres/userQueries");
const { printDebug } = require("./debugHelpers");
const bcrypt = require("bcrypt");
const { checkUsernameExists, checkEmailExists, isPasswordCorrect, isEmailCorrect, isNameCorrect, isDobCorrect } = require("./userHelpers");

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
  printDebug("passport > registerUser", req.body);
  const body = req.body;

  try {
    // check all fields in sign up body
    if (
      !body.username ||
      !body.password ||
      !body.email ||
      !body.first_name ||
      !body.last_name ||
      !body.date_of_birth
    ) {
      throw new Error("Missing data for sign up");
    }
    const { username, password, email, first_name, last_name, date_of_birth } =
      body;

    // username has correct format
    if (username.trim().includes(" ")) {
      throw new Error("Username incorrect formatting. Includes whitespace.");
    }

    // password has correct format
    if (!isPasswordCorrect(password)) {
      throw new Error("Password is bad. Too short.");
    }

    // email has correct format
    if (!isEmailCorrect(email)) {
      throw new Error("Email is badly formatted.");
    }

    // first and last name has correct format
    if (!isNameCorrect(first_name) || !isNameCorrect(last_name)) {
      throw new Error(
        "Names should not contain numbers and should be a string"
      );
    }
    // dob has correct format
    if (!isDobCorrect(date_of_birth)) {
      throw new Error("Date of Birth is badly formatted. Expected: DD-MM-YYYY");
    }


    // CORRECT FORMAT, NOW CHECK IF USER / EMAIL EXISTS
    // check if user exists
    const usernameExists = await checkUsernameExists(username);

    if (usernameExists) {
      throw new Error("Username already exists.");
    }

    // check if email exists
    const emailExists = await checkEmailExists(email);

    if(emailExists){
        throw new Error("Account with this email already exists.");
    }

    // USERNAME / EMAIL DO NOT EXIST, ADD NEW USER
    // encrypt password
    const salt = await bcrypt.genSalt(10);
    const encrypted = await bcrypt.hash(password, salt);

    const user = {
      username: username.trim().toLowerCase(),
      password: encrypted,
      email: body.email.trim(),
      first_name: body.first_name.trim(),
      last_name: body.last_name.trim(),
      date_of_birth: body.date_of_birth.trim()
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
