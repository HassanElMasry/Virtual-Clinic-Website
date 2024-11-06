const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled"],
    default: "pending",
  },
  prescriptions: [
    {
      name: String,
      dose: String,
      filled: Boolean,
      appointmentId: String,
    },
  ],
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
