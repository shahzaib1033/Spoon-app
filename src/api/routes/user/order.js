const express = require('express');
const { ordering, orderStatus,getOrder } = require('../../controllers/user/order');
const { checktokenValidation } = require('../../middlewears/jwttoken');

const router = express.Router();


router.
    post('/ordering', checktokenValidation, ordering)
    .put('/orderStatus', checktokenValidation, orderStatus)
    .get('/getOrder', checktokenValidation, getOrder)

module.exports = router