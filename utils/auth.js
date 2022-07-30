const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {SECRET} = require('../config');
const passport = require("passport");


const adminLogin= async(userData, role, res) => {

    let { email, password } = userData;
    const user =  await User.findOne({email});
    if (!user) {
        return res.status(404).json({
            message: "Credentials not found",
            success: false,
        });

    }

    if (user.role != role) {
        return res.status(401).json({
            message: "NOT AUTHORISED",
            success: false,
            role: `${user.role}`,
            email : `${user.email}`
        });
    }



    let passwordmatch = await bcrypt.compare(password, user.password);
    

    if (passwordmatch) {

        let token = jwt.sign({
            _id: user._id,
            role: user.role,
            email: user.email
        }, SECRET, { expiresIn: "7 days" });

        let authtoken = {
            _id: user._id,
            role: user.role,
            email: user.email,
            token: `Bearer ${token}`,
            expiresIn: 168
        };
        return res.status(200).json({
            authtoken,
            message: `${user.role} SUCESS `,
            success: true
        });

    } else {
        return res.status(404).json({
            message: "WRONG PASSWORD",
            success: false, 
            username: `${req.email}`,
        });
    }
}




const userAuthorization = passport.authenticate("jwt", { session: false });


const verifyRole = roles => (req, res, next) => {
    if(roles.includes(req.user.role)){
        return next()
    }
    return res.status(401).json({
        message: "Not Authorised In this Route",
        success: false
    });
};



module.exports ={
    adminLogin,
    userAuthorization,
    verifyRole
};