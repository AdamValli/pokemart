

const { getAllUsers, getUserById, addNewUser } = require("./postgres/userQueries");
const { checkNewUserBody, checkUpdatesBody } = require("./middleware/userMiddleware");
const express = require("express");
const userRouter = express.Router();

// get all users
// errors: could not find users --> 404 Not Found
userRouter.get("/", async (req, res)=>{
    try {
        const users = await getAllUsers();

        // failure
        if(!users){
            throw new Error("could not retrieve users")
        }

        res.json(users);

    } catch (error) {
        res.sendStatus(404);
    }
});

// get specific user by id
// errors: could not find user --> 404 Not Found
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
        res.sendStatus(404);
    }
})

// post new user
userRouter.post("/newuser", checkNewUserBody, async (req, res)=>{
    const newUser = req.user;
    try {
        const result = await addNewUser(newUser);

        if(!result){
            throw new Error("could not add user, query response empty.");
        }

        res.json(result);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// update specific user by id
userRouter.put("/:id", checkUpdatesBody, (req, res)=>{
    const userId = req.params.id;
    const updates = req.body;
    console.log(req.updates)
    res.json(req.updates)
});

// delete specific user by id
userRouter.delete("/:id", (req, res)=>{
    const userId = req.params.id;
    res.send(`deleting user ${userId}.`);
});




module.exports = userRouter;