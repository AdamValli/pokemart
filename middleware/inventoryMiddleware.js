// must contain name
// if correct, adds req.user with formatted user details
// TODO: format DOB str --> suitable for DB!
const checkNewItemBody = (req, res, next) => {
  const body = req.body;
  try {

    // check mandatory keys present
    if (!body.name) {
      throw new Error("missing data for new item");
    }
    
    // check mandatory values in correct format

    // if optional keys, check in correct format
    if (
      !isNameCorrect(body.name) ||
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

  // add new formatted item to req
  const formattedUser = {
    username: body.username.trim(),
    password: body.password,
    email: body.email,
    fname: body.fname,
    lname: body.lname,
    dob: body.dob,
  };

  req.user = formattedUser;

  next();
};

// accepts multiple updates
// errors: bad update posted --> 400
const checkUpdatesBody = (req, res, next) => {
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
      if (isPassword) formattedUpdates.password = isPassword;
      else throw new Error("bad password");
    }
    if (updates.fname) {
      const isFnameCorrect = isNameCorrect(updates.fname);
      if (isFnameCorrect) formattedUpdates.fname = isFnameCorrect;
      else throw new Error("bad fname");
    }
    if (updates.lname) {
      const isLnameCorrect = isNameCorrect(updates.lname);
      if (isLnameCorrect) formattedUpdates.fname = isLnameCorrect;
      else throw new Error("bad lname");
    }
    if (updates.dob) {
      const isDob = isDobCorrect(updates.dob);
      if (isDob) formattedUpdates.dob = isDob;
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

module.exports = { checkNewUserBody, checkUpdatesBody };
