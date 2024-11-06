const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  filename: String,
  mimetype: String,
  data: Buffer,
});

const doctorSchema = new Schema({
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
  hourlyRate: {
    type: Number,
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
  affiliation: {
    type: String,
    required: true,
  },
  education: {
    degree: { type: String, required: true },
    university: { type: String, required: true },
  },
  files: [fileSchema],
  otp: String,
  wallet: {
    type: Number,
    default: 0,
  },
  contract: {
    type: Boolean,
    default: false,
  },
  availableTimeSlots: [
    {
      date: Date,
    },
  ],
  followUpRequests: [
    {
      patientId: String,
      patientName: String,
      date: Date,
    },
  ],
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
