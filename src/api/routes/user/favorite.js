const express = require('express')
const { addToFavorite, getFavorite, removeFavorite } = require('../../controllers/user/favorite')

const router = express.Router()
const { checktokenValidation } = require('../../middlewears/jwttoken')

router
    .post('/addToFavorite', checktokenValidation, addToFavorite)
    .get('/getFavorite', checktokenValidation, getFavorite)
    .delete('/removeFavorite', checktokenValidation, removeFavorite)




module.exports = router