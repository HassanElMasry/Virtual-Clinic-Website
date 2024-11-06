const appointmentModel = require("../models/appointment.js");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctor.js");
const patientModel = require("../models/patient.js");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email service
  auth: {
    user: "mshereef2003@gmail.com", // Replace with your email
    pass: process.env.GMAIL_PASSWORD, // Replace with your email password or app-specific password
  },
});

const getAppointments = async (req, res) => {
  try {
    // Get the username from the token
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;

    const filters = {};
    const filterOn = req.body.filterOn;

    // Check for filter parameters in req.body

    if (req.body.date) {
      filters.date = req.body.date;
    }
    if (req.body.status) {
      filters.status = req.body.status;
    }

    let appointments = await appointmentModel
      .find()
      .populate("doctor")
      .populate("patient");

    appointments = appointments.filter((appointment) => {
      return (
        appointment.doctor.username === username ||
        appointment.patient.username === username
      );
    });

    // console.log(appointment.doctor.username);
    // console.log(appointment.patient.username);

    if (appointments) {
      // Filter the appointments within the patient's document
      const filteredAppointments = appointments.filter((appointment) => {
        let matches = true;
        if (!filterOn) return true;

        const mongooseDate = appointment.date;
        const day = String(mongooseDate.getDate()).padStart(2, "0");
        const month = String(mongooseDate.getMonth() + 1).padStart(2, "0");
        const year = mongooseDate.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        if (filters.date && formattedDate !== filters.date) {
          matches = false;
        }
        if (filters.status && appointment.status !== filters.status) {
          matches = false;
        }
        console.log(matches);
        return matches;
      });

      res.status(200).json({ appointments: filteredAppointments });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const scheduleAppointment = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;

    const { index } = req.body;
    doctorUsername = req.body.doctor;

    doctor = await doctorModel.findOne({ username: doctorUsername });
    patient = await patientModel.findOne({ username: username });

    const appointment = new appointmentModel({
      doctor: doctor._id,
      patient: patient._id,
      date: doctor.availableTimeSlots[index].date,
      status: "pending",
    });

    console.log(appointment);

    doctor.availableTimeSlots.splice(index, 1);
    await doctor.save();

    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const scheduleFollowUp = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;

    patientUsername = req.body.username;

    doctor = await doctorModel.findOne({ username: username });
    patient = await patientModel.findOne({ username: patientUsername });

    const appointment = new appointmentModel({
      doctor: doctor._id,
      patient: patient._id,
      date: formatDateString(req.body.date),
      status: "pending",
    });

    console.log(appointment);

    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const rescheduleAppointment = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const appointmentId = req.body.appointmentId;
    const appointment = await appointmentModel.findById(appointmentId);
    appointment.date = formatDateString(req.body.date);

    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const requestFollowUp = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const appointment = await appointmentModel.findById(req.body.appointmentId);
    const doctor = await doctorModel.findById(appointment.doctor);
    const patient = await patientModel.findById(appointment.patient);
    doctor.followUpRequests.push({
      patientId: appointment.patient,
      patientName: patient.name,
      date: formatDateString(req.body.date),
    });
    doctor.save();
    res.status(200).json({ message: "Follow up requested" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createCheckoutSessionAppointment = async (req, res) => {
  console.log(process.env.STRIPE_SECRET_KEY);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Appointment",
            },
            unit_amount: 1000 * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/patient/appointment-approved",
      cancel_url: "http://localhost:3000/patient",
    });

    console.log("Session created:", session.id);
    res.send({ sessionId: session.id });
  } catch (e) {
    console.error("Error creating session:", e.message);
    res.status(400).send({ error: e.message });
  }
};

const approveAppointment = async (req, res) => {
  console.log("GGGGG");
  console.log(req.body.appointmentId);
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;

    const appointmentId = req.body.appointmentId;
    const appointment = await appointmentModel.findById(appointmentId);
    appointment.status = "approved";
    appointment.save();

    const patient = await patientModel.findOne({ username: username });
    const doctor = await doctorModel.findById(appointment.doctor);

    const mailOptions = {
      from: "mshereef2003@gmail.com", // Replace with your email
      to: patient.email,
      subject: "Appointment Approved",
      text: `Your appointment with Dr. ${doctor.name} has been approved.`,
    };

    await transporter.sendMail(mailOptions);

    const mailOptions2 = {
      from: "mshereef2003@gmail.com", // Replace with your email
      to: doctor.email,
      subject: "Appointment Approved",
      text: `Your appointment with patient ${patient.name} has been approved.`,
    };

    await transporter.sendMail(mailOptions2);

    return res.status(200).json({ message: "Appointment approved" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserRole = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;

    const patient = await patientModel.findOne({ username: username });
    const doctor = await doctorModel.findOne({ username: username });

    if (patient) {
      res.status(200).json({ role: "patient" });
    } else if (doctor) {
      res.status(200).json({ role: "doctor" });
    } else {
      res.status(200).json({ role: "admin" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  console.log(req.body.appointmentId);
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;

    let patient = await patientModel.findOne({ username: username });
    let doctor = await doctorModel.findOne({ username: username });
    const role = patient == null ? "doctor" : "patient";

    if (!patient && !doctor) {
      return res.status(400).json({ error: "User not found" });
    }

    const appointmentId = req.body.appointmentId;
    const appointment = await appointmentModel.findById(appointmentId);

    if (patient) {
      doctor = await doctorModel.findById(appointment.doctor);
    }

    if (doctor) {
      patient = await patientModel.findById(appointment.patient);
    }

    if (!appointment) {
      return res.status(400).json({ error: "Appointment not found" });
    }

    const mailOptions = {
      from: "mshereef2003@gmail.com", // Replace with your email
      to: patient.email,
      subject: "Appointment Cancelled",
      text: `Your appointment with Dr. ${doctor.name} has been cancelled.`,
    };

    await transporter.sendMail(mailOptions);

    const mailOptions2 = {
      from: "mshereef2003@gmail.com", // Replace with your email
      to: doctor.email,
      subject: "Appointment Cancelled",
      text: `Your appointment with patient ${patient.name} has been cancelled.`,
    };

    await transporter.sendMail(mailOptions2);

    const appointmentDate = moment(appointment.date);
    const currentDate = moment();

    const isWithin24Hours = appointmentDate.diff(currentDate, "hours") <= 24;

    if (
      role == "doctor" &&
      doctor._id.toString() === appointment.doctor.toString()
    ) {
      // Doctor is cancelling the appointment
      // Add refund logic here
      patient.wallet = patient.wallet + 1000;
      patient.save();
      appointment.status = "cancelled";
      appointment.save();
      return res
        .status(200)
        .json({ message: "Appointment cancelled and refund issued" });
    } else if (
      role == "patient" &&
      patient._id.toString() === appointment.patient.toString()
    ) {
      // Patient is cancelling the appointment
      if (isWithin24Hours) {
        // Appointment is within 24 hours, patient doesn't get a refund
        appointment.status = "cancelled";
        appointment.save();
        return res.status(200).json({ message: "Appointment cancelled" });
      } else {
        // Appointment is cancelled before 24 hours, patient gets a refund
        // Add refund logic here
        patient.wallet = patient.wallet + 1000;
        patient.save();
        appointment.status = "cancelled";
        appointment.save();
        return res
          .status(200)
          .json({ message: "Appointment cancelled and refund issued" });
      }
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePrescription = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const appointmentId = req.body.appointmentId;
    const oldMedicine = req.body.oldMedicine;
    const newMedicine = req.body.newMedicine;
    const dose = req.body.dose;

    const appointment = await appointmentModel.findById(appointmentId);
    appointment.prescriptions = appointment.prescriptions.map(
      (prescription) => {
        if (prescription.name === oldMedicine) {
          if (newMedicine != "") prescription.name = newMedicine;
          if (dose != "") prescription.dose = dose;
        }
        return prescription;
      }
    );
    await appointment.save();

    res.status(200).json({ message: "Prescription updated" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const addPrescripton = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const appointmentId = req.body.appointmentId;
    const medicine = req.body.medicine;
    const dose = req.body.dose;
    const filled = req.body.filled == "yes";

    const appointment = await appointmentModel.findById(appointmentId);
    appointment.prescriptions.push({
      name: medicine,
      dose: dose,
      filled: filled,
      appointmentId: appointmentId,
    });
    await appointment.save();

    res.status(200).json({ message: "Prescription added" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const payPrescriptionWallet = async (req, res) => {
  // console.log(req.body.package);
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;

    const patient = await patientModel.findOne({ username });
    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    if (patient.wallet < 1000) {
      return res.status(400).send("Insufficient funds");
    }

    patient.wallet -= 1000;
    await patient.save();

    res.json({ message: "Payment successful" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

function formatDateString(inputDate) {
  // Parse the input date string
  const parsedDate = moment(inputDate, "DD/MM/YYYY HH:mm:ss");

  // Format the date to the desired output format
  const formattedDate = parsedDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  return formattedDate;
}

module.exports = {
  getAppointments,
  scheduleAppointment,
  scheduleFollowUp,
  createCheckoutSessionAppointment,
  getUserRole,
  cancelAppointment,
  approveAppointment,
  rescheduleAppointment,
  requestFollowUp,
  updatePrescription,
  addPrescripton,
  payPrescriptionWallet,
};
