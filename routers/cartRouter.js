


const express = require("express");
const { getAllCarts, getCartById, updateCartById, deleteCartById } = require("../postgres/cartQueries");
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

// update specific cart by id
cartRouter.put("/:id", async (req, res)=>{
    const cartId = req.params.id;
    const body = req.body; // obj > list of item ids
    const updates = { items: [...body]};
    console.log(updates.items)
    try {
        const results = await updateCartById(updates, cartId);

        res.json(results)
    } catch (error) {
        res.sendStatus(500);
    }

    res.send(`updating ${cartId} with updates: ${updates}`);
});

// delete specific cart by id
cartRouter.delete("/:id", async (req, res)=>{
    const cartId = req.params.id;
    try {
        const results = await deleteCartById(cartId);
        res.json(results)
    } catch (error) {
        res.sendStatus(500);
    }
});




module.exports = cartRouter;