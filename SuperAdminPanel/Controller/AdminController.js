const Admin = require("../Schema/AdminProfile.js");
const jwt = require('jsonwebtoken');
const SECRET_KEY = "mysecretkey";
const nodemailer = require('nodemailer');
const User = require('../../TravellerPanel/Schema/userProfile.js');
const Package = require("../../Schemas/Package.schema");
const TravelAgency = require("../../Schemas/TravelAgency.schema");
const HotelOwner = require('../../Schemas/HotelOwnerProfile.schema.js'); 


//signup admin
const signup_admin = async (req, res) => {
    const { name, email, password, CNIC, contact } = req.body;
    const admin = new Admin({ name, email, password, CNIC, contact, disabled: false });
    try {
        await admin.save();
        res.status(200).json(`Admin ${name} created`);
    } catch (err) {
        res.status(422).json(err.message);
    }
};

//login admin
const login_admin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (admin && password === admin.password) {
            const token = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: '1d' });
            res.cookie('auth_token', token, { httpOnly: true });
            console.log(token);
            res.status(200).json(`Login Successful ${admin.name}`);
        }
        else {
            res.status(401).json('Invalid email or password');
        }
    }
    catch (err) {
        res.status(500).json(err.message);
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
            res.status(200).json(`Password sent to ${user.email}`);
        } else {
            res.status(401).json('Invalid email or password');
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
};

//get all users
const get_all_users = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({
            message: "Users retrieved successfully",
            data: users
        });
        const token = req.cookies.auth_token;
        console.log(token);
    } catch (err) {
        res.status(500).send({ message: "Error retrieving users", error: err });
    }
}

//get user byID
const get_user_byID = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (user) {
            res.status(200).send({
                message: "User retrieved successfully",
                data: user
            });
        } else {
            res.status(404).send('User not found');
        }
    }
    catch (err) {
        res.status(500).send({ message: "Error retrieving user", error: err });
    }
}

// Disable user
const disable_user = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (user) {
            user.disabled = true;
            await user.save();

            // Assuming User schema has an 'email' field
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'piper.gulgowski61@ethereal.email',
                    pass: '8fD3yCgVMyhHek1T62'
                }
            });

            await transporter.sendMail({
                from: '"Admin" <admin@example.com>',
                to: user.email,
                subject: "Account Disabled Notification",
                text: `Your account has been disabled.`,
                html: `<b>Your account has been disabled.</b>`
            });

            res.status(200).send(`User ${user.name} has been disabled`);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// Enable user
const enable_user = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (user) {
            user.disabled = false;
            await user.save();

            // Assuming User schema has an 'email' field
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'piper.gulgowski61@ethereal.email',
                    pass: '8fD3yCgVMyhHek1T62'
                }
            });

            await transporter.sendMail({
                from: '"Admin" <admin@example.com>',
                to: user.email,
                subject: "Account Enabled Notification",
                text: `Your account has been enabled.`,
                html: `<b>Your account has been enabled.</b>`
            });

            res.status(200).send(`User ${user.name} has been enabled`);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};



const getAllPackages = async (req, res) => {
    Package.find({})
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


// Disable package
const disable_package = async (req, res) => {
    const { packageId } = req.params;
    try {
        const package = await Package.findById(packageId).populate('travelAgency');
        if (package) {
            package.disabled = true;
            await package.save();

            // Assuming the TravelAgency schema has an 'email' field
            if (package.travelAgency && package.travelAgency.email) {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    auth: {
                        user: 'piper.gulgowski61@ethereal.email',
                        pass: '8fD3yCgVMyhHek1T62'
                    }
                });

                await transporter.sendMail({
                    from: '"Admin" <admin@example.com>',
                    to: package.travelAgency.email,
                    subject: "Package Disabled Notification",
                    text: `The package ${package.name} has been disabled.`,
                    html: `<b>The package ${package.name} has been disabled.</b>`
                });
            }

            res.status(200).send(`Package ${package.name} has been disabled`);
        } else {
            res.status(404).send('Package not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// Enable package
const enable_package = async (req, res) => {
    const { packageId } = req.params;
    try {
        const package = await Package.findById(packageId).populate('travelAgency');
        if (package) {
            package.disabled = false;
            await package.save();

            // Assuming the TravelAgency schema has an 'email' field
            if (package.travelAgency && package.travelAgency.email) {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    auth: {
                        user: 'piper.gulgowski61@ethereal.email',
                        pass: '8fD3yCgVMyhHek1T62'
                    }
                });

                await transporter.sendMail({
                    from: '"Admin" <admin@example.com>',
                    to: package.travelAgency.email,
                    subject: "Package Enabled Notification",
                    text: `The package ${package.name} has been enabled.`,
                    html: `<b>The package ${package.name} has been enabled.</b>`
                });
            }

            res.status(200).send(`Package ${package.name} has been enabled`);
        } else {
            res.status(404).send('Package not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};



// Update Package
const update_Package = async (req, res) => {
    const { packageId } = req.params;
    const updates = req.body;

    try {
        const package = await Package.findById(packageId);
        if (!package) {
            return res.status(404).send('Package not found');
        }

        // Iterate over the keys in the request body and update the package
        Object.keys(updates).forEach(key => {
            package[key] = updates[key];
        });

        await package.save();
        res.status(200).json(`Package ${package.name} has been updated`);
    } catch (err) {
        res.status(500).json(err.message);
    }
};


const getAllRatings = async (req, res) => {
    try {
        const packages = await Package.find({}).lean();
        const packagesWithAvgRating = packages.map(pkg => {
            const avgRating = pkg.ratings.length > 0
                ? pkg.ratings.reduce((sum, rating) => sum + rating, 0) / pkg.ratings.length
                : 0;
            return {
                name: pkg.name,
                avgRating: avgRating.toFixed(1) // Rounds to one decimal place
            };
        }).filter(pkg => pkg.avgRating > 0); // Exclude packages with zero avg rating

        res.status(200).json({
            message: "Packages with non-zero average ratings retrieved successfully",
            data: packagesWithAvgRating
        });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving packages", error: err });
    }
};



//view trend
const view_trend = async (req, res) => {
    try {
        const topPackages = await Package.find({}).sort({ counttotalbookings: -1 }).limit(5);
        res.status(200).send({
            message: "Top 5 most booked packages retrieved successfully",
            data: topPackages
        });
    } catch (err) {
        res.status(500).send({ message: "Error retrieving top booked packages", error: err });
    }
};


//user trends
const view_user_trends = async (req, res) => {
    try {
        const categoryTrends = await Package.aggregate([
            {
                $group: {
                    _id: "$packageCategory",
                    totalBookings: { $sum: "$counttotalbookings" }
                }
            },
            { $sort: { totalBookings: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).send({
            message: "Top 5 popular package categories retrieved successfully",
            data: categoryTrends
        });
    } catch (err) {
        res.status(500).send({ message: "Error retrieving top package category trends", error: err });
    }
};


//get all TravleAgencies
const get_all_travelagencies = async (req, res) => {
    try {
        const travelagencies = await TravelAgency.find({});
        res.status(200).send({
            message: "Travel Agencies retrieved successfully",
            data: travelagencies
        });
    } catch (err) {
        res.status(500).send({ message: "Error retrieving travel agencies", error: err });
    }

}

//get travel agency byID
const get_travelagency_byID = async (req, res) => {
    const { agencyId } = req.params;
    try {
        const travelagency = await TravelAgency.findById(agencyId);
        if (travelagency) {
            res.status(200).send({
                message: "Travel Agency retrieved successfully",
                data: travelagency
            });
        } else {
            res.status(404).send('Travel Agency not found');
        }
    }
    catch (err) {
        res.status(500).send({ message: "Error retrieving travel agency", error: err });
    }
}


//get all feedbacks
const get_all_feedbacks = async (req, res) => {
    try {
        const travelAgencies = await TravelAgency.find({}).select('userFeedback');
        let allFeedbacks = [];

        travelAgencies.forEach(agency => {
            // Combine all feedbacks into a single array
            allFeedbacks = allFeedbacks.concat(agency.userFeedback.map(feedback => {
                return {
                    travelAgencyId: agency._id,
                    travelAgencyName: agency.name,
                    feedback: feedback.feedback,
                    feedbackId: feedback._id, // This line adds the feedback ID
                    customerId: feedback.customerId
                };
            }));
        });

        res.status(200).send({
            message: "All feedbacks retrieved successfully",
            data: allFeedbacks
        });
    } catch (err) {
        res.status(500).send({ message: "Error retrieving feedbacks", error: err });
    }
}



const replyToFeedback = async (req, res) => {
    const { feedbackId } = req.params; // Retrieve feedbackId from params
    const { response } = req.body; // Retrieve response from body

    try {
        // Find the feedback and the associated travel agency
        const agency = await TravelAgency.findOne({ "userFeedback._id": feedbackId }, { 'userFeedback.$': 1 }).populate('userFeedback.customerId');

        if (!agency || !agency.userFeedback || agency.userFeedback.length === 0) {
            return res.status(404).send({ message: "Feedback not found" });
        }

        // Extract the feedback and the user from the populated field
        const feedback = agency.userFeedback[0];
        const user = feedback.customerId; // The customerId is now a populated User document

        console.log(feedback, user);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Concatenate feedback and admin response
        const combinedResponse = `Feedback: ${feedback.feedback}\nResponse: ${response}`;

        // Update the responses array for the user
        const feedbackObject = {
            feedbackId: feedback._id, // Use the feedback's _id
            feedback: combinedResponse
        };
        user.responses.push(feedbackObject);
        await user.save();

        // Send email to user
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'piper.gulgowski61@ethereal.email',
                pass: '8fD3yCgVMyhHek1T62'
            }
        });

        await transporter.sendMail({
            from: '"Admin" <admin@yourdomain.com>',
            to: user.email,
            subject: "Response to your Feedback",
            text: combinedResponse,
        });

        res.status(200).send({ message: "Response sent successfully" });
    } catch (err) {
        res.status(500).send({ message: "Error processing request", error: err });
    }
};




const count_total_users = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.status(200).json({
            message: "Total number of users retrieved successfully",
            count: userCount
        });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving user count", error: err });
    }
};


const count_total_travelagencies = async (req, res) => {
    try {
        const travelAgencyCount = await TravelAgency.countDocuments();
        res.status(200).json({
            message: "Total number of travel agencies retrieved successfully",
            count: travelAgencyCount
        });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving travel agency count", error: err });
    }
};

// Disable agency
const disable_agency = async (req, res) => {
    const { agencyId } = req.params;
    try {
        const agency = await TravelAgency.findById(agencyId);
        if (agency) {
            agency.disabled = true;
            await agency.save();
            res.status(200).send(`Agency ${agency.name} has been disabled`);
        } else {
            res.status(404).send('Agency not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Enable agency
const enable_agency = async (req, res) => {
    const { agencyId } = req.params;
    try {
        const agency = await TravelAgency.findById(agencyId);
        console.log(agency);
        if (agency) {
            agency.disabled = false;
            await agency.save();
            res.status(200).send(`Agency ${agency.name} has been enabled`);
        } else {
            res.status(404).send('Agency not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// Approve Travel Agency
const approve_agency = async (req, res) => {
    const { agencyId } = req.params;

    try {
        const agency = await TravelAgency.findById(agencyId);
        if (!agency) {
            return res.status(404).send('Agency not found');
        }

        agency.approved = "Approved";
        await agency.save();

        res.status(200).send(`Agency ${agency.name} has been approved`);
    } catch (err) {
        res.status(500).send({ message: "Error updating travel agency", error: err });
    }
};


// Reject Travel Agency
const reject_agency = async (req, res) => {
    const { agencyId } = req.params;

    try {
        const agency = await TravelAgency.findById(agencyId);
        if (!agency) {
            return res.status(404).send('Agency not found');
        }

        agency.approved = "Rejected";
        await agency.save();

        res.status(200).send(`Agency ${agency.name} has been rejected`);
    } catch (err) {
        res.status(500).send({ message: "Error updating travel agency", error: err });
    }
};


//getAllHotelOwners
const get_all_hotelowners = async (req, res) => {
    try {
        const hotelowners = await HotelOwner.find({});
        res.status(200).send({
            message: "Hotel Owners retrieved successfully",
            data: hotelowners
        });
    } catch (err) {
        res.status(500).send({ message: "Error retrieving hotel owners", error: err });
    }

}

// Enable hotel owner
const enable_hotel_owner = async (req, res) => {
    const { hotelOwnerId } = req.params;
    try {
        const hotelOwner = await HotelOwner.findById(hotelOwnerId);
        if (hotelOwner) {
            hotelOwner.disabled = false;
            await hotelOwner.save();
            res.status(200).send(`Hotel owner ${hotelOwner.name} has been enabled`);
        } else {
            res.status(404).send('Hotel owner not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Disable hotel owner
const disable_hotel_owner = async (req, res) => {
    const { hotelOwnerId } = req.params;
    try {
        const hotelOwner = await HotelOwner.findById(hotelOwnerId);
        if (hotelOwner) {
            hotelOwner.disabled = true;
            await hotelOwner.save();
            res.status(200).send(`Hotel owner ${hotelOwner.name} has been disabled`);
        } else {
            res.status(404).send('Hotel owner not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};


const get_top_users_by_bookings = async (req, res) => {
    try {
        const topUsers = await User.find({})
            .sort({ counttotalbookings: -1 }) 
            .limit(3) // Limit to top 3 users
            .select('name email counttotalbookings'); // Select only specific fields

        res.status(200).json({
            message: "Top 3 users with the most bookings retrieved successfully",
            data: topUsers
        });
    } catch (err) {
        res.status(500).send({ message: "Error retrieving top users", error: err });
    }
}

const logout_admin = async (req, res) => {
    res.clearCookie('auth_token'); // Clearing the authentication cookie
    res.status(200).send('Logout successful');
};





module.exports = {
    signup_admin,
    login_admin,
    forgot_password,
    get_all_users,
    disable_user,
    enable_user,
    getAllPackages,
    disable_package,
    enable_package,
    update_Package,
    view_trend,
    view_user_trends,
    get_all_travelagencies,
    get_all_feedbacks,
    replyToFeedback,
    getAllRatings,
    count_total_users,
    count_total_travelagencies,
    disable_agency,
    enable_agency,
    get_travelagency_byID,
    approve_agency,
    reject_agency,
    get_all_hotelowners,
    enable_hotel_owner,
    disable_hotel_owner,
    get_top_users_by_bookings,
    logout_admin
};

