


const express = require("express");
const { checkSignUpPostBody, checkUserExists } = require("./middleware/signupMiddleware");
const signupRouter = express.Router();


signupRouter.get("/", (req, res) => {
    res.send("sign up page?");
})

signupRouter.post("/", checkSignUpPostBody, checkUserExists, (req, res)=>{

    res.json(req.signupUser);

});


module.exports = signupRouter;