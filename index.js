const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const morgan = require("morgan");
const express = require("express");
const app = express();

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
passport.use(new LocalStrategy((username, password, done)=>{
    
    const found = {
        id: 1,
        username: "ash1",
        password: "123"
    }
    
    // successful authentication
    if(username === found.username && password === found.password){
       return done(null, {id: found.id, username: found.username})
    } else {
        return done(null, false);
    }

    // error
}));

// add user to session object
passport.serializeUser((user, done)=>{
    printDebug("Serializing User: ", user);

    return done(null, user.id);
});

// get user data from serialized user, by id 
// adds to req.user with additional info
passport.deserializeUser((id, done)=>{

    printDebug("Deserializing User Id: ", id);
    try {
        
        // find user by id
        const found = {
            user: {
                id: 1,
                username: "ash1"
            },
            data: {
                first_name: "ash",
                last_name: "ketchum"
            }
        }
        console.log(found);
        return done(null, {...found});
    } catch (error) {
        return done(error, false);        
    }
});


// routers config
const userRouter = require("./userRouter");
const inventoryRouter = require("./inventoryRouter");
const cartRouter = require("./cartRouter");
const ordersRouter = require("./ordersRouter");
const loginRouter = require("./loginRouter");
const { printDebug } = require("./helpers/debugHelpers");
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
    res.send(
      "Only authenticated personnel have access to this route... and you're one of them! (For now.)"
    );
    return;
  }

  res.redirect("/login");
});


// -------- //
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
