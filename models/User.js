const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    addresses: [
        {
            name: { type: String },
            address: { type: String },
            city: { type: String},
            state: { type: String},
            zip: { type: String },
            contactNo: { type: String }
        }
    ],
    contactNo:{
        type:Number,
        required:true
    },
    dateofbirth:{
        type:Date,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});

const User = mongoose.model('MyUser', userSchema);

module.exports = User;
