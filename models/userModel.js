const mongoose = require('mongoose');
const validator = require('validator');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxLength: [
      40,
      'A project name must be less than or equal to 40 characters'
    ]
    // External Library for validator
    // validate: [
    //   validator.isAlpha,
    //   'A project name must only contain alphabets'
    // ]
  },
  photo: String,
  roles: String,
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    select: false // Hide password from response
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(el) {
        // This only works on CREATE and SAVE, not update!!!
        return el === this.password;
      },
      message: 'Passwords are not the same'
    }
  }
});

// Document Middleware
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await argon2.hash(this.password);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Instance method, available on all user document
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await argon2.verify(userPassword, candidatePassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
