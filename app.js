const express = require("express");
const app = express();
const Logger = require("morgan");
const Parser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const userRoutes = require('./routes/admin-users');
const CORS = require('cors')
mongoose.connect(
  "mongodb://35.202.7.81:27017/hospital",
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


app.use(Logger("dev"));

//app.use('/uploads', express.static('uploads'));
app.use(Parser.urlencoded({ extended: false }));
app.use(Parser.json());
//app.use(CORS());
/*app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
*/
app.use(passport.initialize());
require('./middlewares/passport')(passport);
//app.use("/patients", patientRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
