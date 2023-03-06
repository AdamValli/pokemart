
const morgan = require("morgan");
const express = require("express");
const app = express();

// server config
app.use(express.json(), express.urlencoded({extended: true}), morgan("dev"));


// routers config
const userRouter = require("./userRouter");
const inventoryRouter = require("./inventoryRouter");
const cartRouter = require("./cartRouter");
const ordersRouter = require("./ordersRouter");
app.use("/users", userRouter);
app.use("/carts", cartRouter);
app.use("/inventory", inventoryRouter);
app.use("/orders", ordersRouter);



// -------- //
const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});