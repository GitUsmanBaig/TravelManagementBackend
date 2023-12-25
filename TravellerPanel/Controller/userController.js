const User = require('../Schema/userProfile'); // Assuming you have a User.js in your models directory
const jwt = require('jsonwebtoken');
const SECRET_KEY = "mysecretkey";
const nodemailer = require('nodemailer');
const Package = require("../../Schemas/Package.schema");
const Booking = require("../../Schemas/Booking.schema");
const TravelAgency = require("../../Schemas/TravelAgency.schema");
const BookingHistory = require("../Schema/bookingHistory");
const Hotel = require('../../Schemas/Hotel.schema');

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

const getTravelAgency = async (req, res) => {
    try {
        const travelAgency = await TravelAgency.find();
        res.status(200).send(travelAgency);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

const login_user = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user.disabled) return res.status(401).send('Your account has been disabled by the admin');

        else if (user && password === user.password && !user.disabled) {
            const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1d' });
            res.cookie('auth_token', token, { httpOnly: true }); // Setting the cookie
            // console.log('JWT Token:', token); // Logging the token
            res.status(200).json({ message: `Login Successful ${user.name}`, token });
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        res.status(200).send(user);
    }
    catch (err) {
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
                .json({ message: "Packages retrieved successfully", data });
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving packages", error: err });
        });
};

const getHotelbyID = async (req, res) => {
    const hotelId = req.params.id;
    try {
        const hotel = await Hotel.findById(hotelId);
        res.status(200).send(hotel);
    } catch (err) {
        res.status(500).send(err.message);
    }
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
        if (!user) return res.status(404).send('User not found');
        const confirmationCode = randomNumberGenerator();
        const booking = new Booking({
            noOfPersons,
            startDate: package.startDate,
            endDate: package.endDate,
            packageId: packageId,
            customerId: userId,
            totalAmount: package.totalAmount * noOfPersons,
            bookingDate: Date.now(),
            confirmationCode,
            category: package.packageCategory
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
    const packageId = req.params.id;
    const { token } = req.body;
    const userId = req.user.id;

    try {
        const booking = await Booking.findOne({ customerId: userId, packageId: packageId });
        if (!booking) return res.status(404).send('Booking not found');

        const package = await Package.findById(booking.packageId);
        if (!package) return res.status(404).send('Package not found');

        const travelAgency = await TravelAgency.findById(package.travelAgency); // Changed the variable name to 'travelAgency'
        if (!travelAgency) return res.status(404).send('Travel Agency not found');

        const hotel = await Hotel.findById(package.hotel);
        if (!hotel) return res.status(404).send('Hotel not found');

        if (booking.confirmationCode === token) {
            booking.status = 'confirmed';
            // const bookingHistory = new BookingHistory({
            //     customerId: userId,
            //     bookingDate: Date.now(),
            //     noOfPersons: booking.noOfPersons,
            //     startDate: package.startDate,
            //     endDate: package.endDate,
            //     totalAmount: package.totalAmount * booking.noOfPersons,
            //     name: package.name,
            //     description: package.description,
            //     price: package.price,
            //     city: package.city,
            //     hotel: hotel.name,
            //     travelAgency: TravelAgency.name,
            //     //travelAgencyhelplineNumber: TravelAgency.helplineNumber
            // });
            console.log(package.counttotalbookings);
            package.counttotalbookings += 1;
            console.log(package.counttotalbookings);
            await package.save();
            await booking.save();
            // await bookingHistory.save();
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
        if (Date.now() === booking.startDate) deduction = 0.9;
        else if (hours <= 24) deduction = 0.1;
        else if (hours <= 48) deduction = 0.2;
        else if (hours <= 72) deduction = 0.3;
        else if (hours <= 96) deduction = 0.4;
        else if (hours <= 120) deduction = 0.5;
        //take 90% of the amount if cancelled on the same day
        package.noOfPersons += booking.noOfPersons;

        amountreturned = booking.totalAmount * deduction;
        finalamount = booking.totalAmount - amountreturned;

        console.log(package.counttotalbookings);
        package.counttotalbookings -= 1;
        console.log(package.counttotalbookings);

        console.log(finalamount);
        user.bookingamount = finalamount;

        await Booking.findByIdAndDelete(bookingId);
        await package.save();
        await user.save();

        res.status(200).send(user);

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
            booking.totalAmount = noOfPersons * package.totalAmount;
        }
        else {
            const diff = noOfPersons - booking.noOfPersons;
            package.noOfPersons -= diff;
            booking.totalAmount = noOfPersons * package.totalAmount;
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

const getBookings = async (req, res) => {
    const userId = req.user.id;
    try {
        const bookings = await Booking.find({ customerId: userId });
        res.status(200).send(bookings);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getBookingById = async (req, res) => {
    const bookingId = req.params.id;
    try {
        const booking = await Booking.findById(bookingId);
        res.status(200).send(booking);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getPackageById = async (req, res) => {
    const packageId = req.params.id;
    try {
        const package = await Package.findById(packageId);
        res.status(200).send(package);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const addRating = async (req, res) => {
    const { rating } = req.body;
    const bookingId = req.params.id;
    const userId = req.user.id;
    try {
        const booking = await Booking.findOne({ customerId: userId, _id: bookingId });
        if (!booking) return res.status(422).send('You have not booked this package');
        const package = await Package.findById(booking.packageId);
        if (!package) return res.status(404).send('Package not found');
        //if (Date.now() < booking.endDate) return res.status(422).send('You cannot rate this package before the end date');
        if (rating < 0 || rating > 5) return res.status(422).send('Rating must be between 0 and 5');
        package.ratings.push(rating);
        let sum = 0;
        package.ratings.forEach(rating => {
            sum += rating;
        });
        package.avgRating = sum / package.ratings.length;
        await package.save();
        res.status(200).send('Rating added successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const addReview = async (req, res) => {
    const { review } = req.body;
    const bookingId = req.params.id;
    const userId = req.user.id;
    try {
        const booking = await Booking.findOne({ customerId: userId, _id: bookingId });
        if (!booking) return res.status(422).send('You have not booked this package');
        const package = await Package.findById(booking.packageId);
        if (!package) return res.status(404).send('Package not found');
        //if (Date.now() < booking.endDate) return res.status(422).send('You cannot review this package before the end date');
        const user = await User.findOne({ _id: userId });
        const reviewtoadd = `${user.name}: ${review}`;
        package.reviews.push(reviewtoadd);
        await package.save();
        res.status(200).send('Review added successfully');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

const sendFeedback = async (req, res) => {
    const { feedback } = req.body;
    const userId = req.user.id;
    const bookingId = req.params.id;
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).send('Booking not found');
        const package = await Package.findById(booking.packageId);
        if (!package) return res.status(404).send('Package not found');
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found');
        const travelAgency = await TravelAgency.findById(package.travelAgency);
        if (!travelAgency) return res.status(404).send('Travel Agency not found');
        const feedbacktoadd = `${user.name}: ${user.email}: ${feedback}`;
        const feedbackObject = {
            customerId: userId,
            feedback: feedbacktoadd
        };
        //add user name and user email to feedback
        //if (Date.now() < booking.endDate) return res.status(422).send('You cannot send feedback before the end date');
        //push user name, email and feedback to travel agency
        console.log(feedbacktoadd);
        travelAgency.userFeedback.push(feedbackObject);
        await travelAgency.save();
        res.status(200).send('Feedback sent successfully');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

const getFeedbacksSent = async (req, res) => {
    const userId = req.user.id;

    try {
        const travelAgencies = await TravelAgency.find();
        const feedbacksSent = travelAgencies
            .flatMap(agency => agency.userFeedback)
            .filter(feedback => feedback.customerId.toString() === userId);

        res.status(200).send(feedbacksSent);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


const getFeedbacksReceived = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found');
        res.status(200).send(user.responses);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

const getBookingHistory = async (req, res) => {
    const userId = req.user.id;
    try {
        const bookingHistory = await BookingHistory.find({ customerId: userId });
        res.status(200).send(bookingHistory);
    } catch (err) {
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
    updateBooking,
    getBookings,
    getBookingById,
    getPackageById,
    addRating,
    addReview,
    sendFeedback,
    getBookingHistory,
    getFeedbacksSent,
    getFeedbacksReceived,
    getHotelbyID,
    getProfile,
    getTravelAgency
};