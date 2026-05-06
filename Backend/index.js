const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const routes = require("./routes/api");
app.use("/api", routes);


app.listen(3000, () => {
  console.log("Server running...");
});