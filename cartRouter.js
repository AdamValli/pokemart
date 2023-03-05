


const express = require("express");
const cartRouter = express.Router();

// get all carts
cartRouter.get("/", (req, res)=>{
    res.send("all carts")
});

// get specific cart by id
cartRouter.get("/:id", (req, res)=>{
    const cartId = req.params.id;
    res.send(`cart data for ${cartId}`);
})

// post new cart
cartRouter.post("/newcart", (req, res)=>{
    const userId = req.body;
    res.send("added new cart for user " + userId);
});

// update specific cart by id
cartRouter.put("/:id", (req, res)=>{
    const cartId = req.params.id;
    const updates = req.body;
    res.send(`updating ${cartId} with updates: ${updates}`);
});

// delete specific cart by id
cartRouter.delete("/:id", (req, res)=>{
    const cartId = req.params.id;
    res.send(`deleting cart ${cartId}.`);
});




module.exports = cartRouter;