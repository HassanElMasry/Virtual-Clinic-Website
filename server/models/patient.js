const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  filename: String,
  mimetype: String,
  data: String,
});

const patientSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  emergencyContact: {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  familyMembers: [
    {
      name: String,
      nationalId: String,
      age: Number,
      gender: String,
      relation: String,
    },
  ],
  files: [fileSchema],
  wallet: {
    type: Number,
    default: 0,
  },
  otp: String,
  package: {
    type: String,
  },
  subscriptionStatus: {
    type: String,
    default: "inactive",
  },
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
