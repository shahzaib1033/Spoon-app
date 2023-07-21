const express = require('express');
const Handler = require('../../controllers/user/user');
const { checktokenValidation } = require('../../../config/methods/tokenValidation');
const { giveReview, showReviews } = require('../../controllers/user/reviews')

const {
    signUpHandler,
    resendpassword,
    signinHandler,
    deleteHandler,
    emailValidator,
    updateHandler,
    changePassword,
    forgetPassword,
    resetThePassword,
} = Handler;
const router = express.Router();


router.post('/signup', signUpHandler)
    .post('/signin', signinHandler)
    .post('/verification', emailValidator)
    .post('/changePassword', checktokenValidation, changePassword)
    .post('/giveReview', checktokenValidation, giveReview)
    .get('/showReview', checktokenValidation, showReviews)
    .put('/forgetpassword', forgetPassword)
    .put('/resendOTP', resendpassword)
    .put('/resetThePassword', resetThePassword)
    .put('/uptadeUserName', checktokenValidation, updateHandler)
    .delete('/deleteUser', checktokenValidation, deleteHandler);
module.exports = router; 