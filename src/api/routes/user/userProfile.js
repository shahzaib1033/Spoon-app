const express = require('express')
const {
    create,
    update,
    showProfile,
    upload
} = require('../../controllers/user/userProfile');

const { checktokenValidation } = require('../../../config/methods/tokenValidation');
const { uploads } = require('../../middlewears/uploads');
const router = express.Router();





router.
    post('/createProfile', checktokenValidation, create)
    .put('/updateProfile', checktokenValidation, update)
    .get('/showProfile', checktokenValidation, showProfile)
    .post('/uploadImage', uploads, upload);

module.exports = router; 