

const { getAllUsers, getUserById } = require("./postgres/userQueries");

const express = require("express");
const userRouter = express.Router();

// get all users
userRouter.get("/", async (req, res)=>{
    try {
        const users = await getAllUsers();

        // failure
        if(!users){
            throw new Error("could not retrieve users")
        }

        res.json(users);

    } catch (error) {
        res.sendStatus(500);
    }
});

// get specific user by id
userRouter.get("/:id", async (req, res)=>{
    const userId = req.params.id;

    try {
        const user = await getUserById(userId);

        // failure
        if(!user){
            throw new Error("could not retrieve user with id " + userId);
        }

        res.json(user);

    } catch (error) {
        res.sendStatus(500);
    }
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