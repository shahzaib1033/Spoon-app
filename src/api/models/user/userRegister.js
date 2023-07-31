
const mongoose = require('mongoose');

const registerModel = mongoose.Schema({

    userName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    OTP: {
        type: String,
        unique: true,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isdeleted: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['superAdmin', 'admin', 'user'],
        default: 'user'
    },
    tokenVersion: {
        type: Number
    }




})
const ModelToExport = mongoose.model('userInfo', registerModel);
module.exports = ModelToExport;