const {
  isPasswordCorrect,
  isEmailCorrect,
  isDobCorrect,
  isNameCorrect,
} = require("../helpers/userHelpers");
const { getUserByUsername, getUserByEmail, addNewUser } = require("../postgres/userQueries");
const bcrypt = require("bcrypt");


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


const checkUserExists = async (req, res, next)=>{
    const {username, email} = req.signupUser;

    try {
        const foundUsername = await getUserByUsername(username);

        if(foundUsername.length > 0){
            throw new Error("Username already exists.");
        }
        const foundEmail = await getUserByEmail(email);

        if(foundEmail.length > 0){
            throw new Error("Account with this email already exists.");
        }

        next();
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const registerUser = async (req, res, next) => {
    
    try {
        // encrypt password 
        const salt = await bcrypt.genSalt(10);
        const encrypted = await bcrypt.hash(req.signupUser.password, salt);

        const user = {
            ...req.signupUser,
            password: encrypted
        };
        

        // add user to db
        const result = await addNewUser(user);
        
        // return added user
        req.result = result;

        next();
    } catch (error) {
        res.status(500).send("Could not add user :(");
    }
};

module.exports = {checkSignUpPostBody, checkUserExists, registerUser};