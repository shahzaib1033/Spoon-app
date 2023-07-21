
const userInfo = require('../../models/user/userRegister.js');
const Profile = require('../../models/user/userProfile.js');
const massages = require('../../../config/methods/massage.js');
const userProfile = require('../../models/user/userProfile.js');
const { useSuccessResponse, useErrorResponse } = require('../../../config/methods/response.js');
require("dotenv").config();




const create = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await userInfo.findOne({ _id: id });
        if (!user || !id) {
            console.log(user, id)
            return res.status(404).send(massages.userNotfond)
        }
        const { profileImage, fullName, description, age, gender, phoneNo, hobbies, address } = req.body

        const saveData = await userProfile.create({
            userId: id,
            profileImage: profileImage,
            fullName: fullName,
            description: description,
            age: age,
            gender: gender,
            phoneNo: phoneNo,
            hobbies: hobbies,
            address: address


        });

        saveData.save();
        res.status(200).send("profile successfully created")
    } catch (err) {
        return res.json({ error: err })
    }
}
const update = async (req, res) => {
    try {
        const id = req.user._id;
        const userProfile = await Profile.findOne({ userId: id });
        const { profileImage, fullName, description, age, gender, phoneNo, hobbies, address } = req.body

        userProfile.profileImage = profileImage || userProfile.profileImage,
            userProfile.fullName = fullName || userProfile.fullName,
            userProfile.description = description || userProfile.description,
            userProfile.age = age || userProfile.age,
            userProfile.gender = gender || userProfile.gender,
            userProfile.phoneNo = phoneNo || userProfile.phoneNo,
            userProfile.hobbies = hobbies || userProfile.hobbies,
            userProfile.address = address || userProfile.address
        if (userProfile) {
            const saveData = await userProfile.save();
            const { profileImage, fullName, description, age, gender, phoneNo, hobbies, address } = userProfile
            const ProfileImage = process.env.HOSt + profileImage;
            const data = {
                ProfileImage, fullName, description, age, gender, phoneNo, hobbies, address
            }
            return res.status(200).json({ data: data })
        }
        return res.status(200).send(massages.userProfileNotfond);
    } catch (error) {
        console.log(error);
    }
}
const showProfile = async (req, res) => {
    try {
        const id = req.user._id;
        const userProfile = await Profile.findOne({ userId: id })
        // if (!userProfile) {
        //     return res.status(404).send(massages.userProfileNotfond)
        // }


        const { profileImage, fullName, description, age, gender, phoneNo, hobbies, address } = await userProfile
        const ProfileImage = process.env.HOSt + profileImage;
        const data = {
            ProfileImage, fullName, description, age, gender, phoneNo, hobbies, address
        }
        res.status(200).json(data)
    } catch (error) {
        useErrorResponse(res, error.massage, 500)

    }
}
const upload = async (req, res) => {
    try {
        const imagePath = req.imagePath;
        if (!imagePath) {
            useSuccessResponse(res, 'empty feild', 404)
     }
        const host = process.env.HOST

        console.log(host)
        const ImagePath = host + "" + imagePath;
        console.log(`Uploading ${ImagePath}`);
        useSuccessResponse(res,'success',imagePath,201)
        
    } catch (error) {
        console.log(error)
        useErrorResponse(res,error.massage,404)
    }
}
module.exports = {
    create,
    update,
    showProfile,
    upload
}