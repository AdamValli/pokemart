


const express = require("express");
const { checkNewItemBody, checkUpdatesBody } = require("../middleware/inventoryMiddleware");
const { getAllItems, getItemById, addNewItem, updateitemById, updateItemById, deleteItemById } = require("../postgres/itemQueries");
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
inventoryRouter.put("/:id", checkUpdatesBody, async (req, res)=>{
    const itemId = req.params.id;
    const updates = req.updates;
    try{
        const results = await updateItemById(updates, itemId);

        res.json(results);
    } catch (error) {
        res.status(500).send(error)
    }
});

// delete specific item by id
inventoryRouter.delete("/:id", async (req, res)=>{
    const itemId = req.params.id;

    try {
        const item = await deleteItemById(itemId);
        // failure
        if(!item){
            throw new Error("could not delete item with id " + itemId);
        }

        res.json(item);
        return;
    } catch (error) {
        res.sendStatus(404);
        return;
    }
});




module.exports = inventoryRouter;