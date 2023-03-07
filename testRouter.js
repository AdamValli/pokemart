


const express = require("express");
const { getUserByUsername } = require("./postgres/userQueries");
const testRouter = express.Router();



testRouter.get("/", async (req, res)=>{
    try {
        const user = await getUserByUsername("ash1");

        res.json(user);
    } catch (error) {
        res.sendStatus(500)
    }
})


module.exports = testRouter;