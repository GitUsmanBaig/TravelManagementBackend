const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminProfileSchema = new Schema({
    name: String,
    email: String,
    password: String,
    CNIC: String,
    contact: String,
    disabled: Boolean,

});

const AdminProfile = mongoose.model('AdminProfile', AdminProfileSchema);
module.exports = AdminProfile;
