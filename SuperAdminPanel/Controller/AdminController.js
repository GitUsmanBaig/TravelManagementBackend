const Admin = require("../Schema/AdminProfile.js");
const jwt = require('jsonwebtoken');
const SECRET_KEY = "mysecretkey";
const nodemailer = require('nodemailer');
const User = require('../../TravellerPanel/Schema/userProfile.js');


//signup admin
const signup_admin = async (req, res) => {
    const { name, email, password, CNIC, contact } = req.body;
    const admin = new Admin({ name, email, password, CNIC, contact, disabled: false });
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


const forgot_password = async (req, res) => {
    const { email, CNIC } = req.body;
    try {
        const user = await Admin.findOne({ email });
        if (user && CNIC === user.CNIC) {
            let testAccount = await nodemailer.createTestAccount();

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'piper.gulgowski61@ethereal.email',
                    pass: '8fD3yCgVMyhHek1T62'
                }
            });

            let info = await transporter.sendMail({
                from: '"CustomerCare-VoyageVista" <customercare@voyagevista.com>', // sender address
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


// Disable user
const disable_user = async (req, res) => {
    const { userId } = req.params; 
    try {
        const user = await User.findById(userId);
        if (user) {
            user.disabled = true; 
            await user.save();
            res.status(200).send(`User ${user.name} has been disabled`);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};

//enable user
const enable_user = async (req, res) => {
    const { userId } = req.params; 
    try {
        const user = await User.findById(userId);
        if (user) {
            user.disabled = false; 
            await user.save();
            res.status(200).send(`User ${user.name} has been enabled`);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}; 


module.exports = { signup_admin, login_admin, forgot_password, disable_user, enable_user };

