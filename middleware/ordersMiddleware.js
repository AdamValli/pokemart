const { printDebug } = require("../helpers/debugHelpers");
const { makeQuery } = require("../postgres/queries");

//  userId: integer
const checkNewOrderBody = async (req, res, next) => {
  const order = req.body;
  try {
    const userId = order.userId ? parseInt(order.userId) : false;
    if (!userId) {
      throw new Error("missing user id");
    }
    const items = order.items ? order.items : false;

    // const total_quantity = getTotalQuantity(order);
    // const total_item_price = await getTotalPrice(order);

    const status = order.status
      ? order.status.toString().toLowerCase()
      : "pending";

    // const shipping_price = order.shipping_price
    //   ? parseInt(order.shipping_price)
    //   : 0;

    const newOrder = {
      items,
      status,
      userId,
    //   total_item_price,
    //   total_quantity,
    //   shipping_price,
    };

    req.newOrder = newOrder;
  } catch (error) {
    res.status(401).send(error.message);
    return;
  }

  next();
};

// req.body: { items: [id, id, id... ], status: string }
// can only update items and status
const checkUpdatesBody = async (req, res, next) => {
  const updates = req.body;
  try {
    let formattedUpdates = {};
    
    // add status if status given
    if (updates.status) {
      const statuses = ["complete", "pending", "cancelled"];
      if (!statuses.includes(updates.status.toLowerCase())) {
        throw new Error("status must be complete, pending or cancelled");
      }
      formattedUpdates.status = updates.status.toLowerCase();
    }

    // add items if items given
    if(updates.items){
        formattedUpdates.items = [...updates.items];
    }
    
    req.updates = formattedUpdates;
    next();
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

const checkOrderExists = async (req, res, next) => {
    const orderId = req.params.id;

    try {
        const results = await makeQuery(`SELECT * from orders WHERE id = ${orderId}`);

        printDebug("check Order Exists", results);

        next();
    } catch (error) {
        res.sendStatus(500);
    }
};

const getTotalQuantity = (order) => {
  let total_quantity = 0;
  const items = order.items ? order.items : false;

  if (items) {
    total_quantity = items.length;
  } else {
    total_quantity = parseInt(order.total_quantity);
  }
  return total_quantity;
};

// if items, get items and return sum of price
const getTotalPrice = async (order) => {
  const items = order.items ? order.items : false;
  let sum = 0;

  if (order.total_item_price) {
    return parseInt(order.total_item_price);
  }

  if (items) {
    for (let id of items) {
      const results = await makeQuery(
        `SELECT price FROM items WHERE id = ${id}`
      );
      let price = results[0].price;
      sum = sum + price;
    }
  }
  return sum;
};

module.exports = { checkNewOrderBody, checkUpdatesBody, checkOrderExists };
