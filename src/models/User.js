const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  firstName: !String,
  lastName: !String,
  profilePicture: !String,
});

const userModel = model('User', userSchema);

module.exports = userModel;
