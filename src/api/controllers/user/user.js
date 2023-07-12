//require things
const { emailsender } = require('../../../config/methods/emailsender');
const generatePassword = require('../../../config/methods/generatecode');
const massages = require('../../../config/methods/massage.js');
const userInfo = require('../../models/user/userRegister.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const path = require('path');
require("dotenv").config();

const signUpHandler = async (req, res) => {
    try {

        const { userName, email, password,isAdmin } = req.body;

        const oldUser = await userInfo.findOne({ email })
        if (oldUser) {
            return res.send(massages.alreadyexisting)
        }
        const encryptedpassword = await bcrypt.hash(password, 10)
        const saveData = await userInfo.create({
            userName: userName,
            email: email,
            password: encryptedpassword,
            isAdmin: isAdmin 

        });


        // if (saveData) {
        //     const { _id, documents } = await saveData
        //     console.log(documents)
        // }

        const code = await generatePassword(6)
        console.log(code)
        saveData.OTP = code;
        await saveData.save();
        console.log(saveData.OTP)
        const subject = "User Verification"
        await emailsender(email, code, subject);


        if (saveData) {
            // imgHandler.uploadImages(req, res, _id)

            res.status(200).send(massages.createdNowVerify)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: massages.unexpectedError });

    }

}


const resendpassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userInfo.findOne({ email })
        // const code = await generatePassword();

        // user.forgetpassword = code;
        if (user) {
            const code = await generatePassword(6)
            console.log(code)
            user.OTP = code;
            await user.save();
            console.log(user.OTP)
            const subject = "User Verification"
            await emailsender(email, code, subject);
            res.status(200).json({ massage: "verification code successfully sent to user " });
        }
    } catch (err) {
        return res.json({ error: err })
    }

}

const signinHandler = async (req, res) => {
    try {
        const { email, token, password } = req.body;
        const user = await userInfo.findOne({ email })
        const { userName} = await user
        if (!user.isActive) {
            return res.status(401).send(masssages.verifyFirst)

        }

        const data = { userName, email }
        const tokenVersion = await generatePassword(9);
        if (email && (await bcrypt.compare(password, user.password)) && !(user.isDelete)) {
            const tokens = jwt.sign({ _id: user.id, isAdmin: user.isAdmin, tokenVersion: tokenVersion }, process.env.SECRET);

            
            return res.status(200).json({ tokens, massage: massages.successInLogin, userData: data });
        }

        else {
            res.send(massages.invalidData)
        }
    }

    catch (err) {
        console.log(err);
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
        res.status(200).send(massages.successInUpdate);


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
        await user.save();
        res.status(200).send(massages.successInDelete);
    }
    catch (err) {
        res.json({ message: err.message })

    }
}
const emailValidator = async (req, res) => {

    try {
        const { OTP } = req.body
        const user = await userInfo.findOne({ OTP })
        if (!user) {
            res.send(massages.userNotfond, OTP)
        }
        if (user.OTP === OTP) {
            const tokenVersion = await generatePassword(9);
            const tokens = jwt.sign({ _id: user.id, isAdmin: user.isAdmin, tokenVersion: tokenVersion }, process.env.SECRET);
            // console.log(token, massages.successInLogin)
            const { userName, lastName, email, documents } = await user
            const data = { userName, email, tokens }
            user.isActive = true
            user.OTP = null;
            await user.save();
            console.log(user.isActive)
            res.status(200).json(data);
        }
    } catch (err) {
        res.json(err.message)
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
            return res.status(404).json({ message: massages.userNotfond })
        }
        if (await bcrypt.compare(password, user.password)) {
            const encryptedpassword = await bcrypt.hash(newPassword, 10)
            user.password = encryptedpassword;
            await user.save();
            return res.status(200).send(massages.successInchange);
        }
        return res.send(massages.errorInReset)
    } catch (err) {
        res.json({ error: err })
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userInfo.findOne({ email })

        if (user) {
            const token = crypto.randomBytes(15).toString('hex');
            const url = 'http://ww.abc.com/users/' + token;
            user.OTP = token;
            await user.save();
            const subject = 'Forgot your password'
            await emailsender(email, url, subject);

            res.status(200).json({ url, token });
        }
    } catch (err) {
        return res.json({ message: err.message })
    }
}

const resetThePassword = async (req, res) => {

    try {
        const { newPassword, token } = req.body;
        console.log(token);
        const user = await userInfo.findOne({ OTP: token });
        if (user) {
            console.log(user)
            const encryptedpassword = await bcrypt.hash(newPassword, 10)
            user.password = encryptedpassword;
            user.OTP = null;
            await user.save();
            return res.status(200).send(massages.successInReset);

        }
        res.status(404).send(massages.tokenNotExist)
    } catch (err) {
        res.json({ message: err.message })
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