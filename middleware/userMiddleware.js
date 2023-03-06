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
      !body.fname ||
      !body.lname ||
      !body.dob
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
    fname: body.fname,
    lname: body.lname,
    dob: body.dob,
  };

  req.user = formattedUser;

  next();
};

// TODO: use regex
const isUsernameCorrect = (username) => {
  const hasSpace = username.trim().includes(" ");

  if (typeof username !== "string" || hasSpace) {
    return false;
  }

  return true;
};

// true if password is correctly formatted
const isPasswordCorrect = (password) => {
  const isMinimumLength = password.length >= 5;
  const isString = typeof password === "string";

  if (!isMinimumLength && !isString) {
    return false;
  }

  return true;
};

module.exports = { checkNewUserBody };
