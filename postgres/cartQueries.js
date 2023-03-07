const pool = require("./postgres");

// returns all Carts from Carts table
// errors: could not retrieve Carts --> 500 internal server error
const getAllCarts = async () => {
  const client = await pool.connect();

  try {
    const { rows } = await client.query(`select * from carts LIMIT 100`);

    return rows;
  } catch (error) {
    console.log(error);
    throw new Error("Could not retrieve Carts.");
  } finally {
    client.release();
  }
};

// get specific cart by id
// errors: could not make query -> 500 internal server error
const getCartById = async (cartId) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`select * from carts WHERE id = $1`, [
      cartId
    ]);

    return rows;
  } catch (error) {
    console.log(error);
    throw new Error("error in querying Carts table for id: " + cartId);
  } finally {
    client.release();
  }
};

// add cart to Carts table
// cart args assumed to be correct (by caller)
// RETURN: added cart details
// errors: could not add new cart --> 500 internal server error

const addNewCart = async (cart) => {
  const { name, stock, price, description } = cart;
  const client = await pool.connect();

  try {
    console.log(`inserting { ${name}, ${stock}, ${price}, ${description} into Carts}`)
    const { rows } = await client.query(
      `INSERT INTO Carts 
        (name, stock, price, description)
        VALUES
        ($1, $2, $3, $4)
        RETURNING *;
        `,
      [name, stock, price, description]
    );

    

    return rows;
  } catch (error) {
    console.log(error);
    throw new Error("could not add new cart");
    return;
  } finally {
    client.release();
  }
};

// update cart in Carts table
// args: updates expected to be { items: [id, id, id, ...]}
// errors: could not update cart --> 500 internal server error
// could not find cart to update --> 404 Not Found
const updateCartById = async (updates, cartId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // update Carts set {updates.key} = {updates.value} where id = {cartId}
    await client.query("DELETE FROM carts_items WHERE cart_id = $1", [cartId]);
    for( let itemId of updates.items){
        await client.query(`INSERT INTO carts_items VALUES ($1, $2);`, [cartId, itemId]);
    }
    const results = await client.query(`select * from carts_items where cart_id = $1`, [cartId]);

    await client.query("COMMIT");

    return results.rows;
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("--------- Error update cart by id ---------");
    console.log(error);
    console.log("-------------------------------------------");
    throw new Error(error);
  } finally {
    client.release();
  }
};


const deleteCartById = async (cartId) => {
    const client = await pool.connect();
    try {

      await client.query("BEGIN");

      await client.query("DELETE FROM carts_items WHERE cart_id = $1", [cartId]);

      const { rows } = await client.query(`DELETE FROM carts WHERE id = $1 RETURNING id, user_id`, [
        cartId
      ]);
      await client.query("COMMIT")
      return rows;
    } catch (error) {
      await client.query("ROLLBACK")
      console.log(error);
      throw new Error("error in deleting cart in Carts table for id: " + cartId);
    } finally {
      client.release();
    }
  }


module.exports = { getAllCarts, getCartById, addNewCart, updateCartById, deleteCartById };
