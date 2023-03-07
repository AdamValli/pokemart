



// false if email is incorrect format
// return email if correct format
const isEmailCorrect = (email) => {
    var emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "g");
    const isCorrect = emailRegex.test(email);

    if(!isCorrect) return false;

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

  if (!isMinimumLength || !isString) {
    return false;
  }

  return password;
};


module.exports = {isDobCorrect, isEmailCorrect, isNameCorrect, isUsernameCorrect, isPasswordCorrect};