


const express = require("express");
const inventoryRouter = express.Router();

// get all items in inventory
inventoryRouter.get("/", (req, res)=>{
    res.send("all items")
});

// get specific item by id
inventoryRouter.get("/:id", (req, res)=>{
    const itemId = req.params.id;
    res.send(`user data for ${itemId}`);
})

// post new item to db
inventoryRouter.post("/newitem", (req, res)=>{
    const newItem = req.body;
    res.send("added new user " + newItem);
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