


const express = require("express");
const { checkNewOrderBody, checkUpdatesBody, checkOrderExists } = require("../middleware/ordersMiddleware");
const { getAllOrders, getOrderById, createNewOrder, deleteOrderById, updateOrderById } = require("../postgres/orderQueries");
const ordersRouter = express.Router();





// get all orders
ordersRouter.get("/", async (req, res)=>{
    try {
        const results = await getAllOrders();
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
});

// get specific order by id
ordersRouter.get("/:id", async (req, res)=>{
    const orderId = req.params.id;
    try {
        const results = await getOrderById(orderId);

        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
})

// create new empty order for user id
ordersRouter.post("/neworder", checkNewOrderBody, async (req, res)=>{
    const neworder = req.newOrder;
    try {
        const results = await createNewOrder(neworder);
        res.json(results);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

// update specific order by id
ordersRouter.put("/:id", checkOrderExists, checkUpdatesBody, async (req, res)=>{
    const orderId = req.params.id;
    const updates = req.updates;

    try {
        const results = await updateOrderById(updates, orderId);
        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
});

// delete specific order by id
// don't allow deleting orders? Keep record even if cancelled?
ordersRouter.delete("/:id", async (req, res)=>{
    const orderId = req.params.id;
    try {
        const results = await deleteOrderById(orderId);

        res.json(results);
    } catch (error) {
        res.sendStatus(500);
    }
});




module.exports = ordersRouter;