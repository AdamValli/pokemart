

const { getAllUsers, getUserById, addNewUser, updateUserById, deleteUserById } = require("../postgres/userQueries");
const { checkNewUserBody, checkUpdatesBody, checkUserExists } = require("../middleware/userMiddleware");
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
userRouter.post("/newuser", checkNewUserBody, checkUserExists, async (req, res)=>{
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
userRouter.put("/:id", checkUpdatesBody, async (req, res)=>{
    const userId = req.params.id;
    const updates = req.body;
    try {
        
        const results = await updateUserById(updates, userId);
        res.json(results);
        return;
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
        return;
    }

});

// delete specific user by id
userRouter.delete("/:id", async (req, res)=>{
    const userId = req.params.id;

    try {
        const user = await deleteUserById(userId);
        const test = user ? true: false;
        console.log(test);
        // failure
        if(!user){
            throw new Error("could not delete user with id " + userId);
        }

        res.json(user);
        return;
    } catch (error) {
        res.sendStatus(404);
        return;
    }
});




module.exports = userRouter;