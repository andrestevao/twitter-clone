const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const routes = require("./routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes);

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
