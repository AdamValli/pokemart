
const morgan = require("morgan");
const express = require("express");
const app = express();

// server config
app.use(express.json(), morgan("dev"));


// routers config
const userRouter = require("./userRouter");
const inventoryRouter = require("./inventoryRouter");
const cartRouter = require("./cartRouter");
app.use("/users", userRouter);
app.use("/carts", cartRouter);
app.use("/inventory", inventoryRouter);



// -------- //
const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});