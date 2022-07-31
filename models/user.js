const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        unique: true, 
    },
    password: { type: String, required: true },
    role: {
        type: String,
        default: "patient", 
        enum: ["staff", "doctor", "patient","admin"],
        required: true
      },
    
});

module.exports = mongoose.model('User', adminSchema);