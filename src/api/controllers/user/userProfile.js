
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
            useErrorResponse(res, massages.userNotfond, 404)
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

        const data = saveData.save();
        useSuccessResponse(res, massages.createdProfile, data, 201)

    } catch (err) {
        useErrorResponse(res, massages.internalError, 500)
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
            useSuccessResponse(res, massages.successInUpdate, data, 200)
        }
        useErrorResponse(res, massages.userProfileNotfond, 404)
    } catch (error) {
        console.log(error);
        useErrorResponse(res, massages.internalError, 500)

    }
}
const showProfile = async (req, res) => {
    try {
        const id = req.user._id;
        const userProfile = await Profile.findOne({ userId: id })
        if (!userProfile) {
            useErrorResponse(res, massages.userProfileNotfond, 404)
        }


        const { profileImage, fullName, description, age, gender, phoneNo, hobbies, address } = await userProfile
        const ProfileImage = process.env.HOSt + profileImage;
        const data = {
            ProfileImage, fullName, description, age, gender, phoneNo, hobbies, address
        }
        useSuccessResponse(res, massages.success, data, 200)

    } catch (error) {
        useErrorResponse(res, massage.internalError, 500)

    }
}
const upload = async (req, res) => {
    try {
        const imagePath = req.imagePath;
        if (!imagePath) {
         return   useSuccessResponse(res, 'empty feild', 404)
        }
        const host = process.env.HOST

        console.log(host)
        const ImagePath = host + "" + imagePath;
        console.log(`Uploading ${ImagePath}`);
      return  useSuccessResponse(res, 'success', imagePath, 201)

    } catch (error) {
        console.log(error)
        return useErrorResponse(res, massages.internalError, 500)
    }
}
module.exports = {
    create,
    update,
    showProfile,
    upload
}