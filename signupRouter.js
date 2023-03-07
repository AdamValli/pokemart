


const express = require("express");
const signupRouter = express.Router();


signupRouter.get("/", (req, res) => {
    res.send("sign up page?");
})



module.exports = signupRouter;