


const express = require("express");
const { checkSignUpPostBody, checkUserExists, registerUser } = require("./middleware/signupMiddleware");
const signupRouter = express.Router();


signupRouter.get("/", (req, res) => {
    res.send("sign up page?");
})

signupRouter.post("/", checkSignUpPostBody, checkUserExists, registerUser, (req, res)=>{

    // if registered, authenticate
    res.json({});

});


module.exports = signupRouter;