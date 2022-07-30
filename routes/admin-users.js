const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const {adminLogin,userAuthorization,verifyRole}= require ("../utils/auth");



router.post("/user-registration",userAuthorization,verifyRole(['admin']), async(req, res, next) => {

  

  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(400).json({
          message: "emailid already used by another user"
        });
      } else {
        bcrypt.hash(req.body.password, 5, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              role: req.body.role
            });
            user.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "THE USER IS CREATED "

                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});



router.get("/accounts",userAuthorization,verifyRole(['admin']),(req, res) => {
User.find({},function(error,user)

{
  if (error){
    return
      console.log(err);        
  }
  else {
      res.status(200).json(user)
  }
});




});

router.post("/admin-login",async (req, res) => {

  await adminLogin(req.body,"admin",res);


});






module.exports = router;