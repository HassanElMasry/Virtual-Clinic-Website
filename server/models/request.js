const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  filename: String,
  mimetype: String,
  data: Buffer,
});

const requestSchema = new mongoose.Schema({
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
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
