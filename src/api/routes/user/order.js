const express = require('express');
const { ordering, orderStatus } = require('../../controllers/user/order');
const { checktokenValidation } = require('../../middlewears/jwttoken');

const router = express.Router();


router.
    post('/ordering', checktokenValidation, ordering)
    .put('/ordering', checktokenValidation, ordering)

module.exports = router