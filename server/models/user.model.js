const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: function () {
        return !this.oauthProvider
      },
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verificationCode: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    oauthId: String,
    oauthProvider: {
      type: String,
      enum: ["google", "facebook", "twitter", null],
    },
    avatar: String,
  },
  { timestamps: true },
);

UserSchema.pre("save", (next) =>{
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.createEmailVerificationToken = function () {
  const code = crypto.randomBytes(16).toString("hex");
  this.verificationCode = code;
  return code;
};

UserSchema.methods.signToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
