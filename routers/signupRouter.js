const express = require("express");
const passport = require("passport");
const signupRouter = express.Router();

signupRouter.get("/", (req, res) => {
  res.send("sign up page?");
});


signupRouter.post(
  "/",
  passport.authenticate("local-signup", {
    successRedirect: "/home", // redirect to the secure profile section
    failureRedirect: "/signup", // redirect back to the signup page if there is an error
    failureFlash: true, // allow flash messages
  })
);
module.exports = signupRouter;
