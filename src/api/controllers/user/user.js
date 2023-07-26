//require things
const { useSuccessResponse, useErrorResponse } = require('../../../config/methods/response')
const generatePassword = require('../../../config/methods/generatecode');
const { emailsender } = require('../../../config/methods/emailsender');
const massages = require('../../../config/methods/massage.js');
const userInfo = require('../../models/user/userRegister.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const path = require('path');
const { use } = require('passport');
require("dotenv").config();

const signUpHandler = async (req, res) => {
    try {

        const { userName, email, password, isAdmin } = req.body;

        const oldUser = await userInfo.findOne({ email })
        if (oldUser) {
            return useErrorResponse(res, massages.alreadyexisting, 403)
        }
        const encryptedpassword = await bcrypt.hash(password, 10)
        const saveData = await userInfo.create({
            userName: userName,
            email: email,
            password: encryptedpassword,
            isAdmin: isAdmin

        });


        if (saveData) {
            const code = await generatePassword(4)
            console.log(code)
            saveData.OTP = code;
            await saveData.save();
            console.log(saveData.OTP)
            const subject = "User Verification"
            await emailsender(email, code, subject);


            // imgHandler.uploadImages(req, res, _id)
            return useSuccessResponse(res, massages.createdNowVerify, saveData.email, 200)
        }
        return useErrorResponse(res, massages.unexpectedError, 500)

    } catch (err) {
        console.log(err)
        return useErrorResponse(res, massages.unexpectedError, 500)

    }

}


const resendpassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userInfo.findOne({ email })
        // const code = await generatePassword();

        // user.forgetpassword = code;
        if (user) {
            const code = generatePassword(6)
            console.log(code)
            user.OTP = code;
            await user.save();
            console.log(user.OTP)
            const subject = "User Verification"
            await emailsender(email, code, subject);
            const data = { email }
            return useSuccessResponse(res, massages.sentcode, data, 200)

        }
    } catch (err) {
        return useErrorResponse(res, 'error', 404)
    }

}

const signinHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('i am here')
        const user = await userInfo.findOne({ email })
        const { userName } = await user
        if (!user.isActive) {
            console.log(massages.verifyFirst);
            return useErrorResponse(res, massages.verifyFirst, 401)
        }

        const tokenVersion = await generatePassword(9);
        if (email && (await bcrypt.compare(password, user.password)) && !(user.isDelete)) {
            const tokens = jwt.sign({ _id: user.id, isAdmin: user.isAdmin, tokenVersion: tokenVersion }, process.env.SECRET);
            const data = { userName, email, tokens }
            // console.log(massages.successInLogin);
            // console.log(tokens);

           return useSuccessResponse(res, massages.successInLogin, data, 200)
        }

        else {
        

            return useErrorResponse(res, massages.invalidData, 303)

        }
    }

    catch (err) {
        console.log(err);
        return useErrorResponse(res, massages.verifyFirst, 401)

    }

}

const updateHandler = async (req, res) => {

    try {
        const id = req.user._id;
        const user = await userInfo.findOne({ _id: id })

        const password = await req.body.password;
        console.log(password, user)
        if (await bcrypt.compare(password, user.password)) {
            user.userName = req.body.userName;
        }
        const saveData = await user.save();
        const { userName, email } = saveData
        const data = {
            userName, email,
        }
        return useSuccessResponse(res, massages.successInUpdat, data, 200)


    }
    catch (err) {
        console.log(err)
    }

}

const deleteHandler = async (req, res) => {

    try {
        const id = req.user._id;
        const user = await userInfo.findOne({ _id: id })
        user.isdeleted = true;
        user.isActive = false;
        const { email, userName } = user
        const data = { email, userName }
        await user.save();
        return useSuccessResponse(res, massages.successInDelete, data, 200)

    }
    catch (err) {
        return useErrorResponse(res, 'internel server error', 500)
    }
}
const emailValidator = async (req, res) => {

    try {
        const { OTP } = req.body
        const user = await userInfo.findOne({ OTP })
        if (!user) {
            useErrorResponse(res, massages.userNotfond, 404)
        }
        if (user.OTP === OTP) {
            const tokenVersion = generatePassword(9);
            const tokens = jwt.sign({ _id: user.id, isAdmin: user.isAdmin, tokenVersion: tokenVersion }, process.env.SECRET);
            // console.log(token, massages.successInLogin)
            const { userName, lastName, email, documents } = await user
            const data = { userName, email, tokens }
            user.isActive = true
            user.OTP = null;
            await user.save();
            console.log(user.isActive)
            return useSuccessResponse(res, 'successfully login and varification', data, 200)

        }
        else {
            return useErrorResponse(res, 'invalid data', 400)
        }
    } catch (err) {
        return useErrorResponse(res, 'error', 500)
    }
}

const changePassword = async (req, res) => {
    try {
        console.log('change password')
        const { password, newPassword } = req.body;
        const id = req.user._id;
        const user = await userInfo.findOne({ _id: id });
        console.log(id)
        if (!user) {
            return useSuccessResponse(res, massages.userNotfond, id, 404)
        }
        if (await bcrypt.compare(password, user.password)) {
            const encryptedpassword = await bcrypt.hash(newPassword, 10)
            user.password = encryptedpassword;
            await user.save();
            return useSuccessResponse(res, massages.successInchange, 200)

        }
        return useErrorResponse(res, massages.errorInReset, 404)

    } catch (err) {
        useErrorResponse(res, 'error', 500)

    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userInfo.findOne({ email })

        if (user) {
            const token = crypto.randomBytes(15).toString('hex');
            const url = 'http://localhost:3000/resetPassword/' + token;
            user.OTP = token;
            await user.save();
            const subject = 'Forgot your password'
            await emailsender(email, url, subject);
            return useSuccessResponse(res, 'varification', '', 200)
        }
        return useErrorResponse(res, massages.userNotfond, 404)

    } catch (err) {

        return useErrorResponse(res, 'error', 500)
    }
}

const resetThePassword = async (req, res) => {

    try {
        const { newPassword, token } = req.body;
        console.log(token);
        if (token) {
            const user = await userInfo.findOne({ OTP: token });
            if (user) {
                console.log(user)
                const encryptedpassword = await bcrypt.hash(newPassword, 10)
                user.password = encryptedpassword;
                user.OTP = null;
                await user.save();
                return useSuccessResponse(res, massages.successInReset, '', 200)
            }
            return useErrorResponse(res, massages.tokenNotExist, 404)
        }
        else
            return useErrorResponse(res, massages.tokenNotExist, 404)
    } catch (err) {
        console.log(err);
        return useErrorResponse(res, 'error', 500)

    }

}


module.exports = {
    signUpHandler,
    resendpassword,
    signinHandler,
    deleteHandler,
    emailValidator,
    updateHandler,
    changePassword,
    forgetPassword,
    resetThePassword,

};