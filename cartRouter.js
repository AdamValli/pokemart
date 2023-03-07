


const express = require("express");
const { getAllCarts, getCartById } = require("./postgres/cartQueries");
const cartRouter = express.Router();

// get all carts
cartRouter.get("/", async (req, res)=>{
    try {
        const carts = await getAllCarts();

        // failure
        if(!carts){
            throw new Error("could not retrieve carts")
        }

        res.json(carts);

    } catch (error) {
        res.sendStatus(404);
    }
});

// get specific cart by id
cartRouter.get("/:id", async (req, res)=>{
    const cartId = req.params.id;

    try {
        const cart = await getCartById(cartId);

        // failure
        if(!cart){
            throw new Error("could not retrieve cart with id " + cartId);
        }

        res.json(cart);

    } catch (error) {
        res.sendStatus(404);
    }
})

// post new cart
cartRouter.post("/newcart", (req, res)=>{
    const cartId = req.body;
    res.send("added new cart for cart " + cartId);
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