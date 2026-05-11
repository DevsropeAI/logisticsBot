const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require('express-session');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true only on https
      maxAge: 1000 * 60 * 60,
    },
  })
);

const routes = require("./routes/api");
app.use("/api", routes);


app.listen(2000, () => {
  console.log("Server running...");
});