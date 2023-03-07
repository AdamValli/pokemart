// expected body: {}
//  items: [id, id, ...],
//  status: "string",
//  userId: integer
const checkNewOrderBody = (req, res, next) => {
  const order = req.body;
  try {
    if (order.items) {
      if (order.items.length === 0) {
        const items = order.items;
      } else {
        const items = false;
      }
    } else {
      const items = false;
    }
    const items = order.items ? order.items : false;
    console.log(`items? ${items}`);
    const status = order.status
      ? order.status.toString().toLowerCase()
      : "pending";
    const userId = order.userId ? parseInt(order.userId) : false;
    const total_item_price = order.total_item_price
      ? parseInt(order.total_item_price)
      : 0;
    const total_quantity = order.total_quantity
      ? parseInt(order.total_quantity)
      : 0;
    const shipping_price = order.shipping_price
      ? parseInt(order.shipping_price)
      : 0;

    if (!userId) {
      throw new Error("missing user id");
    }

    // if(!order.items || !order.status || !order.userId){
    //     throw new Error("missing key in new order");
    // }
    // const status = order.status.toString().toLowerCase();
    // const statuses = ["complete", "pending", "cancelled"];

    // if(!statuses.includes(status)){
    //     throw new Error("order status must be COMPLETE, PENDING or CANCELLED");
    // }

    const newOrder = {
      items,
      status,
      userId,
      total_item_price,
      total_quantity,
      shipping_price,
    };

    req.newOrder = newOrder;
  } catch (error) {
    res.status(401).send(error.message);
    return;
  }

  next();
};

module.exports = { checkNewOrderBody };
