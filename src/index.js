//things requires 

const express = require('express');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger/swagger-output.json');
const customCss = fs.readFileSync((__dirname + "/config/swagger/swagger.css"), 'utf8');
const app = express();
const userrouter = require('./api/routes/user/userRegister')
const products = require('./api/routes/admin/products')
const profileRouter = require('./api/routes/user/userProfile')
const cartRouter = require('./api/routes/user/addCart')
const orderRouter = require('./api/routes/user/order')  
require("dotenv").config();
require('./config/DB/connection')
// const { version } = require('env');

// middleware 
app.use(express.static('default'));
app.use(cors())
app.use(express.json())
// app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customCss }));
app.use('/user', userrouter)
app.use('/user/profile', profileRouter)
app.use('/user/Cart', cartRouter)
app.use('/user/order', orderRouter)
app.use('/admin/add', products)
app.use("/images", express.static(path.join("", "public/images")))

app.get('/', function (req, res) {
    res.send('Hello World')
})
//Saver connection


const port = process.env.PORT || 8000

app.listen(3000, () => {
    console.log('app is runing at ', 3000)
})