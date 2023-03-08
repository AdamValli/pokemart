const bcrypt = require("bcrypt");
const { checkUsernameExists, checkEmailExists } = require("../helpers/userHelpers");

// must contain username, password, email, fname, lname, dob
// if correct, adds req.user with formatted user details
// TODO: format DOB str --> suitable for DB!
const checkNewUserBody = (req, res, next) => {
  const body = req.body;
  try {
    if (
      !body.username ||
      !body.password ||
      !body.email ||
      !body.first_name ||
      !body.last_name ||
      !body.date_of_birth
    ) {
      throw new Error("missing data for new user");
    }

    if (
      !isUsernameCorrect(body.username) ||
      !isPasswordCorrect(body.password)
    ) {
      throw new Error(
        "Username or Password is bad form. Please ensure username has no whitespaces and password is at least 5 characters."
      );
    }

    if (!body.email.includes("@")) {
      throw new Error("Email is badly formatted.");
    }
  } catch (error) {
    console.log("--------------- new user body error ---------------");
    console.log("body: ");
    console.table(body);
    console.log("error: ");
    console.log(error);
    console.log("---------------------------------------------------");
    res.status(400).send(error);
    return;
  }

  const formattedUser = {
    username: body.username.trim(),
    password: body.password,
    email: body.email,
    first_name: body.first_name,
    last_name: body.last_name,
    date_of_birth: body.date_of_birth,
  };

  req.user = formattedUser;

  next();
};

// checks if username / email in use. 
const checkUserExists = async (req, res, next) => {
  const user = req.user;
  
  try {
    const usernameExists = await checkUsernameExists(user.username);
    const emailExists = await checkEmailExists(user.email);

    if(usernameExists || emailExists){
      throw new Error(
        "Username or Email already in use."
      )
    }

    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};


// accepts multiple updates
// errors: bad update posted --> 400
const checkUpdatesBody = async (req, res, next) => {
  const updates = req.body;
  const formattedUpdates = {};

  // if username updating, check if username correctly formatted
  // if password updating, check if password correctly formatted
  // if fname / lname updating, check if fname / lname is correctly formatted
  // if dob updating, check if dob correctly formatted
  try {
    if (updates.username) {
      const isUsername = isUsernameCorrect(updates.username);
      if (isUsername) formattedUpdates.username = isUsername;
      else throw new Error("bad username");
    }
    if (updates.password) {
      const isPassword = isPasswordCorrect(updates.password);
      if (isPassword) {
        // hash password first
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(isPassword, salt);
        formattedUpdates.password = hashed;
      } else throw new Error("bad password");
    }
    if (updates.first_name) {
      const isFnameCorrect = isNameCorrect(updates.first_name);
      if (isFnameCorrect) formattedUpdates.first_name = isFnameCorrect;
      else throw new Error("bad fname");
    }
    if (updates.last_name) {
      const isLnameCorrect = isNameCorrect(updates.last_name);
      if (isLnameCorrect) formattedUpdates.last_name = isLnameCorrect;
      else throw new Error("bad lname");
    }
    if (updates.date_of_birth) {
      const isDob = isDobCorrect(updates.date_of_birth);
      if (isDob) formattedUpdates.date_of_birth = isDob;
      else throw new Error("bad DOB");
    }
    if (updates.email) {
      const isEmail = isEmailCorrect(updates.email);
      if (isEmail) formattedUpdates.email = isEmail;
      else throw new Error("bad email address");
    }

    if (!formattedUpdates) throw new Error("bad updates or nothing to update");
  } catch (error) {
    console.log("--------- Error: check update body ----------");
    console.log(error);
    console.log("---------------------------------------------");
    res.status(400).send(error.message);
    return;
  }

  req.updates = formattedUpdates;

  next();
};

// false if email is incorrect
// return email if correct
const isEmailCorrect = (email) => {
  var emailRegex = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    "g"
  );
  const isCorrect = emailRegex.test(email);

  if (!isCorrect) return false;

  return email;
};

// return false if DOB not correctly formatted
// return DOB if correctly formatted
// TODO: Doesn't check 00-00-XXXX
const isDobCorrect = (dob) => {
  var dobRegex = new RegExp(/^(\d\d-\d\d-\d\d\d\d)$/, "g");

  const isCorrect = dobRegex.test(dob);

  if (!isCorrect) return false;

  return dob;
};

// return false if name is incorrectly formatted (has nums, is not string)
// returns name is correct
const isNameCorrect = (name) => {
  const isNotString = !(typeof name === "string") ? true : false;
  var hasNumRegex = new RegExp(/\d/, "g");
  const hasNum = hasNumRegex.test(name);

  console.log(`${name} has nums: ${hasNum[0]}`);
  if (isNotString || hasNum) {
    return false;
  }

  return name;
};

// TODO: use regex
// return false if username is incorrectly formatted (has whitespace)
// return formatted username for sb : String
const isUsernameCorrect = (username) => {
  const hasSpace = username.trim().includes(" ");

  if (typeof username !== "string" || hasSpace) {
    return false;
  }

  return username.trim();
};

// true if password is correctly formatted
const isPasswordCorrect = (password) => {
  const isMinimumLength = password.length >= 5;
  const isString = typeof password === "string";

  if (!isMinimumLength && !isString) {
    return false;
  }

  return password;
};

module.exports = { checkNewUserBody, checkUpdatesBody, checkUserExists };
