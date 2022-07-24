const express = require("express");
const app = express();
const Logger = require("morgan");
const Parser = require("body-parser");
const mongoose = require("mongoose");

//const patientRoutes = require("./api/routes/patients");
const userRoutes = require('./routes/users');

mongoose.connect(
  "mongodb://127.0.0.1:27017/Hospital",
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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

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