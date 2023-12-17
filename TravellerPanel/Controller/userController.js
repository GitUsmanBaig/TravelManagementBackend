const User = require('../Schema/userProfile'); // Assuming you have a User.js in your models directory
const jwt = require('jsonwebtoken');
const SECRET_KEY = "mysecretkey";
const nodemailer = require('nodemailer');
const Package = require("../../Schemas/Package.schema");
const Booking = require("../../Schemas/Booking.schema");

const signup_user = async (req, res) => {
    const { name, email, password, CNIC, contact, preferences } = req.body;
    const user = new User({ name, email, password, CNIC, contact, preferences, disabled: false });
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
        if (user.disabled) return res.status(401).send('Your account has been disabled by the admin');

        else if (user && password === user.password && !user.disabled) {
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

const logout_user = (req, res) => {
    // console.log('Auth token: ' + req.cookies.auth_token);
    res.cookie('auth_token', '');
    // console.log('now Auth token: ' + req.cookies.auth_token);
    res.status(200).send('Logged out successfully');
};

const customize_profile = async (req, res) => {
    const userId = req.user.id;
    const { contact, preferences, password } = req.body;
    try {
        const user = await User.findById(userId);
        if (contact) user.contact = contact;
        if (preferences) user.preferences = preferences;
        if (password) user.password = password;
        await user.save();
        res.status(200).send('Credentials updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getAllPackages = async (req, res) => {
    Package.find({ disabled: false })
        .then(data => {
            res
                .status(200)
                .send({ message: "Packages retrieved successfully", data });
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving packages", error: err });
        });
};

const bookPackage = async (req, res) => {
    const userId = req.user.id;
    const { noOfPersons } = req.body;
    const packageId = req.params.id;
    try {
        const package = await Package.findById(packageId);
        if (package.noOfPersons < noOfPersons) return res.status(422).send('Number of persons exceeds the limit');
        const checkBooking = await Booking.findOne({ customerId: userId, packageId: packageId });
        if (checkBooking) return res.status(422).send('You have already booked this package');
        const user = await User.findById(userId);
        const confirmationCode = randomNumberGenerator();
        const booking = new Booking({
            noOfPersons,
            startDate: package.startDate,
            endDate: package.endDate,
            packageId: packageId,
            customerId: userId,
            totalAmount: package.totalAmount * noOfPersons,
            bookingDate: Date.now(),
            confirmationCode
        });
        package.noOfPersons -= noOfPersons;

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
            subject: "Confirmation Code", // Subject line
            text: `Hey ${user.name}, your password has been recovered ${user.password}`, // plain text body
            html: `Hey ${user.name}, your confirmation code for booking of package ${package.name} is <b>${booking.confirmationCode}<b>`, // html body
        });

        console.log("Message sent: %s", info.messageId);

        await booking.save();
        await package.save();
        res.status(200).send('Package booked successfully. Your confirmation code has been sent to your email');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const randomNumberGenerator = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const confirmationPackage = async (req, res) => {
    const bookingId = req.params.id; // Assuming you pass the booking ID in URL params
    const { token } = req.body;
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).send('Booking not found');

        if (booking.confirmationCode === token) {
            booking.status = 'confirmed';
            await booking.save();
            res.status(200).send('Booking confirmed');
        } else {
            res.status(422).send('Invalid confirmation code');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const cancelBooking = async (req, res) => {
    const bookingId = req.params.id;
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).send('Booking not found');
        const package = await Package.findById(booking.packageId);
        if (!package) return res.status(404).send('Package not found');
        const user = await User.findById(booking.customerId);
        if (!user) return res.status(404).send('User not found');
        const diff = Date.now() - booking.bookingDate;
        const hours = Math.ceil(diff / (1000 * 60 * 60));
        let deduction = 0;
        if (hours <= 24) deduction = 0.1;
        else if (hours <= 48) deduction = 0.2;
        else if (hours <= 72) deduction = 0.3;
        else if (hours <= 96) deduction = 0.4;
        else deduction = 0.5;
        package.noOfPersons += booking.noOfPersons;
        package.totalAmount -= booking.totalAmount * deduction;

        console.log(package.totalAmount);

        await Booking.findByIdAndDelete(bookingId);
        res.status(200).send('Booking cancelled successfully');

    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

const updateBooking = async (req, res) => {
    const { id } = req.params;
    const { noOfPersons } = req.body;
    const { token } = req.body;
    try {
        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).send('Booking not found');
        if (booking.confirmationCode !== token) return res.status(422).send('Invalid confirmation code');
        const package = await Package.findById(booking.packageId);
        if (!package) return res.status(404).send('Package not found');
        if (noOfPersons < 0) return res.status(422).send('Number of persons cannot be negative');
        if (noOfPersons === 0) return res.status(422).send('Number of persons cannot be zero');
        if (noOfPersons === booking.noOfPersons) return res.status(422).send('Number of persons cannot be same');
        if (noOfPersons < booking.noOfPersons) {
            const diff = booking.noOfPersons - noOfPersons;
            package.noOfPersons += diff;
            package.totalAmount -= diff * package.totalAmount;
        }
        else {
            const diff = noOfPersons - booking.noOfPersons;
            package.noOfPersons -= diff;
            package.totalAmount += diff * package.totalAmount;
        }
        booking.noOfPersons = noOfPersons;
        await booking.save();
        await package.save();
        res.status(200).send('Number of persons updated successfully');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    signup_user,
    login_user,
    forgot_password,
    logout_user,
    customize_profile,
    getAllPackages,
    bookPackage,
    confirmationPackage,
    cancelBooking,
    updateBooking
};