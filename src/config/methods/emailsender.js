

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const emailsender = async (email, code, subject) => {
    try {
        const transport = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });

        const mailOptions = ({
            from: process.env.NAME,
            to: email,
            subject: subject,
            html: `       <h1>Assalam Alaikum</h1>
        <h2>verify your email with code</h2>
        <p>${code}</p>
      `
        });
        await transport.sendMail(mailOptions)

        console.log('Email sent successfully');
        return true;

    } catch (err) {
        console.log("Email sent failed");
        console.log(err);

    }
};


module.exports = {
    emailsender
}