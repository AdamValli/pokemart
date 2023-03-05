
const morgan = require("morgan");
const express = require("express");
const app = express();

// server config
app.use(express.json(), morgan("dev"));


// routers config
const userRouter = require("./userRouter");
app.use("/users", userRouter);



// -------- //
const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});