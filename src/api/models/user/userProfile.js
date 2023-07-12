const mongoose = require('mongoose');



const profileModel = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "userInfo"
    },
    profileImage: {
        type: String,
        require: true,
        default: ""
    },
    fullName: {
        type: String,
        require: true
    },
    description: {
        type: String,
        unique: true,
        require: true
    },
    age: {
        type: String,
        require: true
    },

    gender: {
        type: String,
        require: true
    },
    phoneNo: {
        type: String,
        require: true
    },
    hobbies: {
        type: String,
        require: true
    },
    address: [
        {
            addresstype: {
                type: String,
                require: true
            }, 
            country: {

                type: String,
                require: true
            },
            city: {
                type: String,
                require: true
            },
            district:
            {
                type: String,
                require: true
            },
            streetNo:
            {
                type: String,
                require: true
            },
            houseNo:
            {
                type: String,
                require: true
            },

        }
    ],


})
module.exports = mongoose.model("profileInfo", profileModel)