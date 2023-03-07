


const express = require("express");
const { checkNewItemBody } = require("./middleware/inventoryMiddleware");
const { getAllItems, getItemById, addNewItem } = require("./postgres/itemQueries");
const inventoryRouter = express.Router();

// get all items in inventory
inventoryRouter.get("/", async (req, res)=>{
    try {
        const items = await getAllItems();

        // failure, useless ?
        if(!items){
            throw new Error("could not retrieve users")
        }

        res.json(items);

    } catch (error) {
        res.sendStatus(404);
    }

  });



// get specific item by id
inventoryRouter.get("/:id", async (req, res)=>{
    const itemId = req.params.id;
    try {
        const item = await getItemById(itemId);

        // failure
        if(item.length < 1){
            throw new Error("could not retrieve item with id " + itemId);
        }

        res.json(item);

    } catch (error) {
        res.status(404).send(error.message);
    }
})

// post new item to db
// CREATE ITEM : { ... IN } AND PASS TO GETITEMBYID()
inventoryRouter.post("/newitem", checkNewItemBody,  async (req, res)=>{
    const newItem = req.newItem;

    try {
        const result = await addNewItem(newItem);

        if(!result){
            throw new Error("could not add item, query response empty.");
        }

        res.json(result);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// update specific item by id
inventoryRouter.put("/:id", (req, res)=>{
    const itemId = req.params.id;
    const updates = req.body;
    res.send(`updating ${itemId} with updates: ${updates}`);
});

// delete specific item by id
inventoryRouter.delete("/:id", (req, res)=>{
    const itemId = req.params.id;
    res.send(`deleting user ${itemId}.`);
});




module.exports = inventoryRouter;