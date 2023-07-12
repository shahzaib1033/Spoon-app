const express = require('express');
const { AddCart, deleteCartProduct, getCartProducts } = require('../../controllers/user/AddCart')
const { checktokenValidation } = require('../../middlewears/jwttoken');

const routes = express.Router();

routes
    .post('/addcart', checktokenValidation, AddCart)
    .delete('/deletecart', checktokenValidation, deleteCartProduct)
    .get('/getcart', checktokenValidation, getCartProducts) 
  
module.exports = routes;