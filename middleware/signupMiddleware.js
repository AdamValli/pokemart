const {
  isPasswordCorrect,
  isEmailCorrect,
  isDobCorrect,
  isNameCorrect,
} = require("../helpers/userHelpers");

const checkSignUpPostBody = (req, res, next) => {
  const body = req.body;
  try {
    // missing data
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

    console.log("checking complete")
    req.signupUser = {
        username: username.trim(),
        password,
        email,
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        date_of_birth
    }
    console.log(req.signupUser)
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {checkSignUpPostBody};