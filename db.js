const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
mongoose.set("strictQuery", false);
const connect = () =>
  mongoose
    .connect("mongodb://127.0.0.1:27017/Jungle-Intuition")
    .then(() => console.log("connected to db"))

    .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  name: { type: String, minLength: 2, maxLength: 50, required: true },
  email: {
    type: String,
    minLength: 6,
    maxLength: 255,
    required: true,
    unique: true,
  },
  password: { type: String, minLength: 6, maxLength: 1064, required: true },
  services: { type: Array },
  created_at: { type: Date, default: Date.now },
});
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { services: this.services,name:this.name,email:this.email, _id: this._id },
    process.env.PRIVATE_KEY
  );
};





const userValidationWithJoi = (user) => {
  const schema = joi.object({
    name: joi.string().min(2).max(50).required(),
    email: joi.string().min(6).max(255).required().email(),
    password: joi.string().min(6).max(1064).required(),
  });
  return schema.validate(user);
};
const signInValidation = (user) => {
  const schema = joi.object({
    email: joi.string().min(6).max(255).required().email(),
    password: joi.string().min(6).max(1064).required(),
  });
  return schema.validate(user);
};
const User = mongoose.model("User", userSchema, "users");


const appointmentSchema = new mongoose.Schema({
  name: { type: String, minLength: 2, maxLength: 50, required: true },
  email: {
    type: String,
    minLength: 6,
    maxLength: 255,
  },
  role:{type: String}, 
  created_at: { type: Date, default: Date.now },
});
const Appointment = mongoose.model("Appointment", appointmentSchema, "appointments");







module.exports = { userValidationWithJoi, signInValidation, User, connect,Appointment };
