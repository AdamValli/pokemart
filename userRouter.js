


const express = require("express");
const userRouter = express.Router();

// get all users
userRouter.get("/", (req, res)=>{
    res.send("all users")
});

// get specific user by id
userRouter.get("/:id", (req, res)=>{
    const userId = req.params.id;
    res.send(`user data for ${userId}`);
})

// post new user
userRouter.post("/newuser", (req, res)=>{
    const newUser = req.body;
    res.send("added new user " + newUser.username);
});

// update specific user by id
userRouter.put("/:id", (req, res)=>{
    const userId = req.params.id;
    const updates = req.body;
    res.send(`updating ${userId} with updates: ${updates}`);
});

// delete specific user by id
userRouter.delete("/:id", (req, res)=>{
    const userId = req.params.id;
    res.send(`deleting user ${userId}.`);
});




module.exports = userRouter;