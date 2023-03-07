// must contain name
// if correct, adds req.newItem with formatted item details
const checkNewItemBody = (req, res, next) => {
  const body = req.body;
  let itemName = body.name;
  let newStock = body.stock;
  let newPrice = body.price;
  let newDescription = body.description;
  console.log(`${typeof newStock}, ${typeof newPrice}`)
  try {

    // check mandatory keys present
    if (!itemName) {
      throw new Error("missing data for new item");
    }
    
    // if(newStock === "NaN" || newPrice === "NaN"){
    //   throw new Error("stock or price is not a number!");
    // }
    
  } catch (error) {
    console.log("--------------- new item error ---------------");
    console.log("body: ");
    console.table(body);
    console.log("error: ");
    console.log(error);
    console.log("---------------------------------------------------");
    res.status(400).send(error);
    return;
  }

  // add new formatted item to req
  const formattedItem = {
    name: body.name.trim().toLowerCase(),
    stock: newStock ? parseInt(newStock): 0,
    price: newPrice ? parseInt(newPrice) : 0,
    description: newDescription ? newDescription.toString() : null, 
  };

  req.newItem = formattedItem;

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


module.exports = { checkUpdatesBody, checkNewItemBody };
