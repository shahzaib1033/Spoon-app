const { useSuccessResponse, useErrorResponse } = require('../../../config/methods/response')
const massages = require('../../../config/methods/massage.js');
const userInfo = require('../../models/user/userRegister.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const addAdmin = async (req, res) => {
    try {
        const { _id, role } = req.user;
        console.log('i am hare')
        if (!(role == 'superAdmin')) {
            return useErrorResponse(res, massages.unAutherized, 403)
        } else {
            const { userName, email, password, role } = req.body;
            const oldUser = await userInfo.findOne({ email ,isdeleted:false})
            if (oldUser) {
                return useErrorResponse(res, massages.alreadyexisting, 403)
            }
            const token = crypto.randomBytes(15).toString('hex');

            const encryptedpassword = await bcrypt.hash(password, 10)
            const saveData = await userInfo.create({
                userName: userName,
                email: email,
                password: encryptedpassword,
                role: role,
                isActive: true,
                OTP: token
            });
            await saveData.save()
            if (saveData) {

                return useSuccessResponse(res, massages.createdNowVerify, saveData, 200)

            }

            return useErrorResponse(res, massages.unexpectedError, 500)
        }
    } catch (err) {
        console.log(err)
        return useErrorResponse(res, massages.unexpectedError, 500)

    }

}

const deleteAdmin = async (req, res) => {
    try {
        const { _id, role } = req.user;
        if (!(role == 'superAdmin')) {
            return useErrorResponse(res, massages.unAutherized, 403)
        }
        const { id } = req.body;
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
const getAdmin = async (req, res) => {
    try {
        const { _id, role } = req.user;
        if (role !== 'superAdmin') {
            return useErrorResponse(res, massages.unAutherized, 403);
        }

        const admins = await userInfo.find({ role: 'admin' , isdeleted:false});

        if (admins.length > 0) {
            const data = admins.map((admin) => {
                const { _id, email, userName, role } = admin;
                return { _id, email, userName, role };
            });

            return useSuccessResponse(res, massages.success, data, 200);
        } else {
            return useErrorResponse(res, massages.notfound, 404);
        }
    } catch (err) {
        return useErrorResponse(res, 'internal server error', 500);
    }
};

module.exports = {
    addAdmin,
    deleteAdmin,
    getAdmin
}