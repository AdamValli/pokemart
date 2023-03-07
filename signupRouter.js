


const express = require("express");
const { checkSignUpPostBody, checkUserExists, registerUser } = require("./middleware/signupMiddleware");
const signupRouter = express.Router();


signupRouter.get("/", (req, res) => {
    res.send("sign up page?");
})

signupRouter.post("/", checkSignUpPostBody, checkUserExists, registerUser, (req, res)=>{

    res.json(req.result);

});


module.exports = signupRouter;