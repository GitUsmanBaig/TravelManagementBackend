
const User = require('../Schema/userProfile'); // Assuming you have a User.js in your models directory
const jwt = require('jsonwebtoken');
const SECRET_KEY = "mysecretkey";

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
        if (user && password === user.password && !user.disabled) {
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

module.exports = { signup_user, login_user };