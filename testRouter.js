


const express = require("express");
const { getUserByUsername } = require("./postgres/userQueries");
const testRouter = express.Router();



testRouter.get("/", async (req, res)=>{
    try {
        const results = await getUserByUsername("ash1");
        const isFound = results.length > 0 ? true : false;
        const user = {...results[0]}; 
        res.json(user);
    } catch (error) {
        res.sendStatus(500)
    }
})


module.exports = testRouter;