const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Make sure to require bcrypt

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  resetToken: {
    type: String,
    select: false // Won't be returned in queries unless explicitly asked for
  },
  resetTokenExpires: {
    type: Date,
    select: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  console.log("Pre-save hook activated");
console.log("Password before hashing:", this.password);

  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);