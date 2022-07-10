const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);

const errorControllers = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const mongoose = require("mongoose");

const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://huymq:huymq123456@cluster0-gm4fb.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();
const store = new mongoDBStore({ uri: MONGODB_URI, collection: "sessions" });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  User.findById("62ca8b238988dbfbe025a116")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use("/", errorControllers.get404);

mongoose
  .connect(MONGODB_URI)
  // .then((result) => {
  //   const user = new User({
  //     name: "Max",
  //     email: "test@gmail.com",
  //     cart: { items: [] },
  //   });
  //   return user.save();
  // })
  .then((result) => {
    console.log("connect database");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
