const pool = require("./postgres");

// returns all items from items table
// errors: could not retrieve items --> 500 internal server error
const getAllItems = async () => {
  const client = await pool.connect();

  try {
    const { rows } = await client.query(`select * from items LIMIT 100`);

    return rows;
  } catch (error) {
    console.log(error);
    throw new Error("Could not retrieve items.");
  } finally {
    client.release();
  }
};

// get specific item by id
// errors: could not make query -> 500 internal server error
const getItemById = async (itemId) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`select * from items WHERE id = $1`, [
      itemId,
    ]);

    return rows;
  } catch (error) {
    console.log(error);
    throw new Error("error in querying items table for id: " + itemId);
  } finally {
    client.release();
  }
};

// add item to items table
// item args assumed to be correct (by caller)
// RETURN: added item details
// errors: could not add new item --> 500 internal server error

const addNewItem = async (item) => {
  const { name, stock, price, description } = item;
  const client = await pool.connect();

  try {
    console.log(`inserting { ${name}, ${stock}, ${price}, ${description} into ITEMS}`)
    const { rows } = await client.query(
      `INSERT INTO items 
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
    throw new Error("could not add new item");
    return;
  } finally {
    client.release();
  }
};

// update item in items table
// args: updates expected to be populated with one of more of {itemname, password, email, fname, lname, dob}
// errors: could not update item --> 500 internal server error
// could not find item to update --> 404 Not Found
const updateitemById = async (updates, itemId) => {
  const client = await pool.connect();
  const parsedUpdates = parseUpdates(updates);

  try {
    await client.query("BEGIN");

    // update items set {updates.key} = {updates.value} where id = {itemId}
    for( let key in parsedUpdates){
        await client.query(`UPDATE items SET ${key} = $1 WHERE id = $2`, [parsedUpdates[key], itemId])
    }
    const results = await client.query(`select * from items where id = $1`, [itemId]);

    await client.query("COMMIT");

    return results.rows;
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("--------- Error update item by id ---------");
    console.log(error);
    console.log("-------------------------------------------");
    throw new Error(error);
  } finally {
    client.release();
  }
};


const deleteitemById = async (itemId) => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`DELETE FROM items WHERE id = $1 RETURNING id, itemname`, [
        itemId
      ]);
  
      return rows;
    } catch (error) {
      console.log(error);
      throw new Error("error in deleting item in items table for id: " + itemId);
    } finally {
      client.release();
    }
  }

// return updates object with key-values suitable for db
const parseUpdates = (updates) => {
  const newUpdates = {};

  for (let i in updates) {
    let key = i;
    let value = updates[i];

    if (key === "fname") key = "first_name";
    if (key === "lname") key = "last_name";
    if (key === "dob") key = "date_of_birth";

    newUpdates[key] = value;
  }

  return newUpdates;
};

module.exports = { getAllItems, getItemById, addNewItem, updateitemById, deleteitemById };
