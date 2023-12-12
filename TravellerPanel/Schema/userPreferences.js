const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userPreferencesSchema = new Schema({
    favoriteDestinations: [String],
    travelStyles: [String]
});

const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);
module.exports = UserPreferences;
