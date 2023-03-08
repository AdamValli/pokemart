


const express = require("express");
const { getUserByUsername } = require("../postgres/userQueries");
const testRouter = express.Router();
const passport = require("passport");



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
 testRouter.post("/", (req, res)=>{
    res.redirect("/test/newtest");
 })

 testRouter.post("/newtest", passport.authenticate('local-signup', {
    successRedirect : '/home', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}))

module.exports = testRouter;