// must contain name

const { checkItemExistsByName } = require("../helpers/inventoryHelpers");

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


// checks if username / email in use. 
const checkItemNameExists = async (req, res, next) => {
  const item = req.newItem;
  
  try {
    const itemNameExists = await checkItemExistsByName(item.name);

    if(itemNameExists){
      throw new Error(
        "Item already exists with this name. It's id: " + itemNameExists
      )
    }

    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
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
    if (updates.name) {
      formattedUpdates.name = updates.name.trim().toString().toLowerCase();
    }
    if (updates.stock) {
      const newStock = parseInt(updates.stock);
      formattedUpdates.stock = newStock;
    }
    if (updates.price) {
      const newPrice = parseInt(updates.price);
      formattedUpdates.price = newPrice;
    }
    if (updates.description) {
      const newDescription = updates.description.toString();
      formattedUpdates.description = newDescription;
    }

    if (!formattedUpdates) throw new Error("bad updates or nothing to update");
  } catch (error) {
    console.log("--------- Error: check item update body ----------");
    console.log(error);
    console.log("---------------------------------------------");
    res.status(400).send(error.message);
    return;
  }

  req.updates = formattedUpdates;

  next();
};

module.exports = { checkUpdatesBody, checkNewItemBody, checkItemNameExists };
