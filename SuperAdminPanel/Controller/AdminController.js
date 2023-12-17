const Admin = require("../Schema/AdminProfile.js");
const jwt = require('jsonwebtoken');
const SECRET_KEY = "mysecretkey";
const nodemailer = require('nodemailer');

//signup admin
const signup_admin = async (req, res) => {
    const { name, email, password, CNIC, contact } = req.body;
    const admin = new Admin({ name, email, password, CNIC, contact });
    try {
        await admin.save();
        res.status(200).send(`Admin ${name} created`);
    } catch (err) {
        res.status(422).send(err.message);
    }
};

//login admin
const login_admin = async (req, res) => {
    const { email, password } = req.body;
    try{
        const admin  = await Admin.findOne({email});
        if(admin && password === admin.password){
            const token = jwt.sign({id: admin._id}, SECRET_KEY, {expiresIn: '1d'});
            res.cookie('auth_token', token);
            res.status(200).send(`Login Successful ${admin.name}`);
        }
        else{
            res.status(401).send('Invalid email or password');
        }
    }
    catch(err){
        res.status(500).send(err.message);
    }
}

module.exports = { signup_admin, login_admin };

