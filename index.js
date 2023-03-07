const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const morgan = require("morgan");
const express = require("express");
const app = express();

const { authUser, serializeUser, deserializeUser } = require("./helpers/passportHelpers");
const { printDebug } = require("./helpers/debugHelpers");


// server config
app.use(express.json(), express.urlencoded({ extended: true }), morgan("dev"));

// session / passport config
const store = new session.MemoryStore();
app.use(
  session({
    secret: "helloSecret",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      // httpOnly: true,
      maxAge: 10000,
      secure: false,
      sameSite: true,
    },
    user: {
      username: null,
      password: null,
    },
    authenticated: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
    

passport.use(new LocalStrategy(authUser));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);



// routers config
const userRouter = require("./userRouter");
const inventoryRouter = require("./inventoryRouter");
const cartRouter = require("./cartRouter");
const ordersRouter = require("./ordersRouter");
const loginRouter = require("./loginRouter");
const testRouter = require("./testRouter");
app.use("/users", userRouter);
app.use("/carts", cartRouter);
app.use("/inventory", inventoryRouter);
app.use("/orders", ordersRouter);
app.use("/login", loginRouter);
app.use("/test", testRouter);


// routes
app.get("/home", (req, res) => {
  console.log(req.session);
  if (req.isAuthenticated()) {
    res.json(req.user);
    return;
  }

  res.redirect("/login");
});


// -------- //
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
