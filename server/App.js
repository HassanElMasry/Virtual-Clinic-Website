// External variables
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const Cookies = require("js-cookie");
const cors = require("cors");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const http = require("http");
const socketIo = require("socket.io");

mongoose.set("strictQuery", false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI;

const maxAge = 3 * 24 * 60 * 60;

const upload = multer({ storage: multer.memoryStorage() });

const Admin = require("./models/admin.js");
const Doctor = require("./models/doctor.js");
const Patient = require("./models/patient.js");
const Request = require("./models/request.js");
const Package = require("./models/package.js");

const doctorModel = require("./models/doctor.js");
const patientModel = require("./models/patient.js");
const adminModel = require("./models/admin.js");
const requestModel = require("./models/request.js");
const packageModel = require("./models/package.js");

const {
  registerPatient,
  getPatients,
  removePatient,
  addFamilyMember,
  linkFamilyMember,
  getFamilyMembers,
  getPrescriptions,
  getPatientsFiltered,
  uploadHealthRecords,
  getFile,
  getHealthRecords,
  getWalletP,
  getSubscriptionInfo,
  cancelSubscription,
  subscribePackageWallet,
  createCheckoutSession,
} = require("./controllers/patientController");
const {
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
} = require("./controllers/appointmentController.js");
const {
  getRequests,
  removeRequest,
  acceptRequest,
} = require("./controllers/requestController.js");
const {
  addAdmin,
  getAdmins,
  removeAdmin,
} = require("./controllers/adminController.js");
const {
  getPackages,
  addPackage,
  updatePackage,
  deletePackage,
} = require("./controllers/packageController.js");
const {
  getDoctorsFiltered,
  getDoctors,
  removeDoctor,
  modifyDoctor,
  getWalletD,
  acceptContract,
  addAvailableTimeSlot,
  getFollowUpRequests,
  acceptFollowUpRequest,
  rejectFollowUpRequest,
} = require("./controllers/doctorController.js");
const { async } = require("rxjs");

//App variables
const app = express();
const port = process.env.PORT || "8000";
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // The frontend origin
    methods: ["GET", "POST"],
  },
});

// Configurations

const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email service
  auth: {
    user: "mshereef2003@gmail.com", // Replace with your email
    pass: process.env.GMAIL_PASSWORD, // Replace with your email password or app-specific password
  },
});

// Mongo DB & Starting Server
mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    server.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust to your client domain
    credentials: true, // This allows cookies to be sent
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes

app.get("/home", (req, res) => {
  res.status(200).send("You have everything installed!");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const doctor = await doctorModel.findOne({ username: username });
    const patient = await patientModel.findOne({ username: username });
    const admin = await adminModel.findOne({ username: username });

    if (patient) {
      if (patient.password !== password) {
        res.status(400).json({ error: "Password is incorrect" });
        return;
      }
      const patientObject = patient.toObject();
      patientObject.role = "patient"; // Add the new field here
      patientObject.files = [];
      const token = jwt.sign(patientObject, process.env.ACCESS_TOKEN_SECRET);
      res.cookie("token", token, {
        secure: false, // Set to false for local testing
        sameSite: "lax", // or 'none'
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ token: token });

      return;
    }
    if (admin) {
      if (admin.password !== password) {
        res.status(400).json({ error: "Password is incorrect" });
        return;
      }
      const adminObject = admin.toObject();
      adminObject.role = "admin"; // Add the new field here
      const token = jwt.sign(adminObject, process.env.ACCESS_TOKEN_SECRET);
      res.cookie("token", token, {
        secure: false, // Set to false for local testing
        sameSite: "lax", // or 'none'
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ token: token });
      return;
    }
    if (doctor) {
      if (doctor.password !== password) {
        res.status(400).json({ error: "Password is incorrect" });
        return;
      }
      const doctorObject = doctor.toObject();
      doctorObject.role = "doctor"; // Add the new field here
      doctorObject.files = [];
      const token = jwt.sign(doctorObject, process.env.ACCESS_TOKEN_SECRET);
      res.cookie("token", token, {
        secure: false, // Set to false for local testing
        sameSite: "lax", // or 'none'
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ token: token });
      return;
    }
    res.status(400).json({ error: "User not found" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/logout", (req, res) => {
  res.status(200).send("Logged out successfully");
});

app.post("/change-password", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    const hasUpperCase = /[A-Z]/.test(req.body.password);
    const hasNumber = /\d/.test(req.body.password);

    if (!hasUpperCase) {
      throw new Error("Password must include at least one capital.");
    }

    if (!hasNumber) {
      throw new Error("Password must include at least one number.");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { username, role } = decoded;

    let user;
    if (role === "patient") {
      user = await patientModel.findOne({ username });
    } else if (role === "doctor") {
      user = await doctorModel.findOne({ username });
    } else if (role === "admin") {
      user = await adminModel.findOne({ username });
    }

    user.password = req.body.password;
    await user.save();

    res.send("Password changed successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/reset-password", async (req, res) => {
  try {
    const username = req.body.username;
    let user;
    let admin;
    let doctor;
    let patient;
    let role;

    admin = await adminModel.findOne({ username: username });
    if (admin != null) role = "admin";

    patient = await patientModel.findOne({ username: username });
    if (patient != null) role = "patient";

    doctor = await doctorModel.findOne({ username: username });
    if (doctor != null) role = "doctor";

    if (role === "admin") user = admin;
    if (role === "patient") user = patient;
    if (role === "doctor") user = doctor;

    userEmail = user.email;

    // const userEmail = user.email;

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit OTP

    // Send OTP to user's email
    const mailOptions = {
      from: "mshereef2003@gmail.com", // Replace with your email
      to: userEmail,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    user.otp = otp;
    await user.save();

    res.send("OTP sent to email.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/verify-otp", async (req, res) => {
  const { username, newPassword, otp } = req.body;

  try {
    const username = req.body.username;
    let user;
    let admin;
    let doctor;
    let patient;
    let role;

    admin = await adminModel.findOne({ username: username });
    if (admin != null) role = "admin";

    patient = await patientModel.findOne({ username: username });
    if (patient != null) role = "patient";

    doctor = await doctorModel.findOne({ username: username });
    if (doctor != null) role = "doctor";

    if (role === "admin") user = admin;
    if (role === "patient") user = patient;
    if (role === "doctor") user = doctor;

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Verify OTP
    // Assuming the OTP is stored in the user object and you have a method to validate it
    if (req.body.otp != user.otp) {
      return res.status(400).send("Invalid OTP.");
    }

    // Update password
    user.password = newPassword;

    await user.save();

    res.send("Password reset successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/register-patient", registerPatient);
app.post("/submit-doctor-request", upload.array("files"), async (req, res) => {
  const {
    username,
    name,
    email,
    hourlyRate,
    password,
    dob,
    affiliation,
    education,
  } = req.body;

  try {
    // Process the files
    const processedFiles = req.files.map((file) => ({
      filename: file.originalname,
      mimetype: file.mimetype,
      data: file.buffer, // Buffer data of the file
    }));

    // Create the doctor document
    const request = await requestModel.create({
      username,
      name,
      email,
      hourlyRate,
      password,
      dob,
      affiliation,
      education: JSON.parse(education),
      files: processedFiles, // Assuming 'files' field in doctorModel schema
    });
    console.log(request);
    request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/userRole", getUserRole);

app.post("/admin/add-admin", addAdmin);
app.get("/admin/admin-list", getAdmins);
app.post("/admin/remove-admin", removeAdmin);
app.get("/admin/patient-list", getPatients);
app.post("/admin/remove-patient", removePatient);
app.get("/admin/doctor-list", getDoctors);
app.post("/admin/remove-doctor", removeDoctor);
app.get("/admin/request-list", getRequests);
app.post("/admin/accept-request", acceptRequest);
app.post("/admin/remove-request", removeRequest);
app.get("/admin/packages", getPackages);
app.post("/admin/add-package", addPackage);
app.post("/admin/update-package", updatePackage);
app.post("/admin/delete-package", deletePackage);

app.post("/patient/add-family-member", addFamilyMember);
app.post("/patient/link-family-member", linkFamilyMember);
app.post("/patient/family-member-list", getFamilyMembers);
app.post("/patient/prescription-list", getPrescriptions);
app.post("/patient/appointment-list", getAppointments);
app.post("/patient/doctor-list", getDoctorsFiltered);
app.post(
  "/patient/health-records-upload",
  upload.array("files"),
  uploadHealthRecords
);
app.post("/patient/get-health-records", getHealthRecords);
app.post("/patient/getFile", getFile);
app.get("/patient/get-wallet", getWalletP);
app.post("/patient/schedule-appointment", scheduleAppointment);
app.get("/patient/packages", getPackages);
app.get("/patient/package-info", getSubscriptionInfo);
app.post("/patient/subcribe-package-wallet", subscribePackageWallet);
app.post("/patient/cancel-subscription", cancelSubscription);
app.post("/patient/create-checkout-session", createCheckoutSession);
app.post(
  "/patient/create-checkout-session-appointment",
  createCheckoutSessionAppointment
);

app.post("/doctor/edit", modifyDoctor);
app.post("/doctor/patient-list", getPatientsFiltered);
app.get("/doctor/get-wallet", getWalletD);
app.get("/doctor/follow-up-list", getFollowUpRequests);
app.post("/doctor/accept-contract", acceptContract);
app.post("/doctor/add-available-time-slot", addAvailableTimeSlot);
app.post("/doctor/schedule-followup", scheduleFollowUp);
app.post(
  "/doctor/upload-health-record-for-patient",
  upload.array("files"),
  uploadHealthRecords
);
app.post("/doctor/accept-follow-up", acceptFollowUpRequest);
app.post("/doctor/reject-follow-up", rejectFollowUpRequest);

app.post("/appointment/cancel-appointment", cancelAppointment);
app.post("/appointment/approve-appointment", approveAppointment);
app.post("/appointment/reschedule-appointment", rescheduleAppointment);
app.post("/appointment/request-follow-up", requestFollowUp);
app.post("/appointment/update-prescription", updatePrescription);
app.post("/appointment/add-prescription", addPrescripton);
app.post("/appointment/pay-prescription-wallet", payPrescriptionWallet);

const users = {};

const socketToRoom = {};

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("sendMessage", ({ roomId, message }) => {
    io.to(roomId).emit("receiveMessage", message);
  });

  socket.on("join room", (roomID) => {
    console.log("join room");
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 4) {
        socket.emit("room full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    console.log("sending signal");
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    console.log("returning signal");
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
  });
});

app.post("/create-chat-room", (req, res) => {
  const roomId = Math.random().toString(36).substring(2, 9); // Generate random roomId
  const email = req.body.email; // Email from request body

  // Define the email options
  const mailOptions = {
    from: "mshereef2003@gmail.com",
    to: email,
    subject: "Your Chat Room Link",
    text: `Join the chat room: http://localhost:3000/chat?roomId=${roomId}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Email sent", roomId: roomId });
    }
  });
});

app.post("/create-video-room", (req, res) => {
  const roomId = Math.random().toString(36).substring(2, 9); // Generate random roomId
  const email = req.body.email; // Email from request body

  // Define the email options
  const mailOptions = {
    from: "mshereef2003@gmail.com",
    to: email,
    subject: "Your Chat Room Link",
    text: `Join the chat room: http://localhost:3000/room/${roomId}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Email sent", roomId: roomId });
    }
  });
});
