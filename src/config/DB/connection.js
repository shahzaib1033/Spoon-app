const mongoose = require('mongoose');
require("dotenv").config();
// const connection = async () => {


mongoose.connect(process.env.DATABASE).then(() => {
    console.log('db connected to \n mongodb');
}).catch(() => {
    console.log('db connection failed');
});
// }
// module.exports =
//     {connection};