const User = require('../Schema/userProfile'); // Assuming you have a User.js in your models directory
const jwt = require('jsonwebtoken');
const SECRET_KEY = "mysecretkey";
const nodemailer = require('nodemailer');

const signup_user = async (req, res) => {
    const { name, email, password, CNIC, contact, preferences } = req.body;
    const user = new User({ name, email, password, CNIC, contact, preferences });
    try {
        await user.save();
        res.status(200).send(`User ${name} created`);
    } catch (err) {
        res.status(422).send(err.message);
    }
};

const login_user = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && password === user.password) {
            const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1d' });
            res.cookie('auth_token', token);
            res.status(200).send(`Login Successful ${user.name}`);
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const forgot_password = async (req, res) => {
    const { email, CNIC } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && CNIC === user.CNIC) {
            let testAccount = await nodemailer.createTestAccount();

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'akeem63@ethereal.email',
                    pass: 'b3AG6n6aSKXhZZDASk'
                }
            });

            let info = await transporter.sendMail({
                from: '"Abdullah Daniyal" <abdullah@voyagevista.com>', // sender address
                to: user.email, // list of receivers
                subject: "Password Recovered", // Subject line
                text: `Hey ${user.name}, your password has been recovered ${user.password}`, // plain text body
                html: `Hey ${user.name}, your password has been recovered. Your password was <b>${user.password}</b>`, // html body
            });

            console.log("Message sent: %s", info.messageId);
            res.status(200).send(`Password sent to ${user.email}`);
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = { signup_user, login_user, forgot_password };