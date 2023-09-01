const cors = require("cors");
const express = require("express");
const app = express();
const initRoutes = require("./routes");
const session = require('express-session');
const flash = require('connect-flash');
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
const bodyParser = require('body-parser');
// ...
app.use(bodyParser.json());
initRoutes(app);

let port = 8000;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});