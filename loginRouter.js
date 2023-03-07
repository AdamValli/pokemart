

const express = require("express");
const loginRouter = express.Router();
const passport = require("passport");

// GET login page
loginRouter.get("/", (req, res)=>{
    res.send("login page");
});

// POST login to authenticate
loginRouter.post("/", passport.authenticate('local', {
    successRedirect: "/home",
    failureRedirect: "/login",
}));



module.exports = loginRouter;