// payment.js
const stripe = require('stripe');
require('dotenv').config();
const { stripeSecretKey } = process.env.PAYSECRET

const stripeClient = stripe(stripeSecretKey);

// Define a function to process a payment
async function processPayment(req,res,next) {
    try {
        const payment = await stripeClient.paymentIntents.create({
           amount: req.body.amount,
            currency: 'usd',
            payment_method: req.body.cardToken,
            confirm: true,
        });

        // Process the payment response and handle success/failure cases
        if (payment.status === 'succeeded') {
            console.log('Payment successful!');
            
            // Handle success case
        } else {
            console.log('Payment failed!');
            // Handle failure case
        }
    } catch (error) {
        console.error('Payment error:', error);
        // Handle error case
    }
}

module.exports = {
    processPayment,
};
