const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const routes = require("./routes/api");
app.use("/api", routes);


app.listen(2000, () => {
  console.log("Server running...");
});