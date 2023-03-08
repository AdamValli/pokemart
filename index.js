const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const morgan = require("morgan");
const express = require("express");
const app = express();

const {
  authUser,
  serializeUser,
  deserializeUser,
  registerUser,
} = require("./helpers/passportHelpers");
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

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    registerUser
  )
);

passport.use(new LocalStrategy(authUser));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

// routers config
const userRouter = require("./routers/userRouter");
const inventoryRouter = require("./routers/inventoryRouter");
const cartRouter = require("./routers/cartRouter");
const ordersRouter = require("./routers/ordersRouter");
const loginRouter = require("./routers/loginRouter");
const testRouter = require("./routers/testRouter");
const signupRouter = require("./routers/signupRouter");
app.use("/users", userRouter);
app.use("/carts", cartRouter);
app.use("/inventory", inventoryRouter);
app.use("/orders", ordersRouter);
app.use("/login", loginRouter);
app.use("/test", testRouter);
app.use("/signup", signupRouter);

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
