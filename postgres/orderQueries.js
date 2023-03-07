const { printDebug } = require("../helpers/debugHelpers");
const pool = require("./postgres");

// returns all orders from orders table
// errors: could not retrieve orders --> 500 internal server error
const getAllOrders = async () => {
  const client = await pool.connect();

  try {
    const { rows } = await client.query(`select * from orders LIMIT 100`);

    return rows;
  } catch (error) {
    console.log(error);
    throw new Error("Could not retrieve orders.");
  } finally {
    client.release();
  }
};

// get specific order by id
// errors: could not make query -> 500 internal server error
const getOrderById = async (orderId) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`select * from orders WHERE id = $1`, [
      orderId,
    ]);

    return rows;
  } catch (error) {
    console.log(error);
    throw new Error("error in querying orders table for id: " + orderId);
  } finally {
    client.release();
  }
};
// requires userId
// creates empty order if no additional params passed.
const createNewOrder = async (order) => {
  console.log("creating order...");
  const {
    items,
    userId,
    status
  } = order;
  printDebug("createNewOrder: order received", order);
  const client = await pool.connect();

  // 1. create new order in orders
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO orders 
        (user_id, status)
        VALUES
        ($1, $2)
        RETURNING *;
        `,
      [userId, status]
    );

    console.log(`order_id: ${rows[0].id}`);

    // add orders with orders sent
    if (items) {
      const orderId = rows[0].id;
      for (let i of items) {
        await client.query("INSERT INTO orders_items VALUES ($1, $2);", [
          orderId,
          i,
        ]);
      }
    }

    const results = await client.query(
      "SELECT * FROM orders WHERE user_id = $1",
      [userId]
    );

    await client.query("COMMIT");

    return results.rows;
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    throw new Error("could not create new order");
  } finally {
    client.release();
  }
};

// update order in orders table
// args: updates expected to be { items: [id, id, id, ...]}
// errors: could not update order --> 500 internal server error
// could not find order to update --> 404 Not Found
const updateOrderById = async (updates, orderId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    
    if (updates.items) {
      // update orders set {updates.key} = {updates.value} where id = {orderId}
      await client.query("DELETE FROM orders_items WHERE order_id = $1", [
        orderId,
      ]);
      for (let itemId of updates.items) {
        await client.query(`INSERT INTO orders_items VALUES ($1, $2);`, [
          orderId,
          itemId,
        ]);
      }
    }

    if(updates.status){
      await client.query(`UPDATE orders SET status = $1 WHERE id = $2`, [updates.status, orderId]);
    }



    const itemResults = await client.query(
      `select items.name from items
      JOIN orders_items ON items.id = orders_items.item_id
      WHERE orders_items.order_id = $1`,
      [orderId]
    );

    const orderResults = await client.query(
      `SELECT * from orders WHERE id = $1`, [orderId]
    )
    await client.query("COMMIT");


    const results = {
      itemResults: itemResults.rows,
      orderResults: orderResults.rows
    }

    return results;
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("--------- Error update order by id ---------");
    console.log(error);
    console.log("-------------------------------------------");
    throw new Error(error);
  } finally {
    client.release();
  }
};

const deleteOrderById = async (orderId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM orders_items WHERE order_id = $1", [
      orderId,
    ]);

    const { rows } = await client.query(
      `DELETE FROM orders WHERE id = $1 RETURNING id, user_id`,
      [orderId]
    );
    await client.query("COMMIT");
    return rows;
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    throw new Error(
      "error in deleting order in orders table for id: " + orderId
    );
  } finally {
    client.release();
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createNewOrder,
  updateOrderById,
  deleteOrderById,
};
