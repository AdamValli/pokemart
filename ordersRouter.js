


const express = require("express");
const ordersRouter = express.Router();

// get all orders
ordersRouter.get("/", (req, res)=>{
    res.send("all orders")
});

// get specific order by id
ordersRouter.get("/:id", (req, res)=>{
    const orderId = req.params.id;
    res.send(`order data for ${orderId}`);
})

// post new order
ordersRouter.post("/neworder", (req, res)=>{
    const neworder = req.body;
    res.send("added new order " + neworder.ordername);
});

// update specific order by id
ordersRouter.put("/:id", (req, res)=>{
    const orderId = req.params.id;
    const updates = req.body;
    res.send(`updating ${orderId} with updates: ${updates}`);
});

// delete specific order by id
// don't allow deleting orders? Keep record even if cancelled?
ordersRouter.delete("/:id", (req, res)=>{
    const orderId = req.params.id;
    res.send(`deleting order ${orderId}.`);
});




module.exports = ordersRouter;