const patientModel = require("../models/patient");
const doctorModel = require("../models/doctor");
const appointmentModel = require("../models/appointment");
const packageModel = require("../models/package");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const registerPatient = async (req, res) => {
  const {
    username,
    name,
    email,
    gender,
    password,
    dob,
    mobile,
    emergencyContact,
  } = req.body;
  try {
    const patient = await patientModel.create({
      username,
      name,
      email,
      gender,
      password,
      dob,
      mobile,
      emergencyContact,
    });
    res.status(200).json(patient);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await patientModel.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removePatient = async (req, res) => {
  const { username } = req.body;
  try {
    const patient = await patientModel.findOneAndDelete({ username: username });
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addFamilyMember = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username1 = decoded.username;

    const patient = await patientModel.findOne({ username: username1 });
    const { username, ...otherFields } = req.body;
    patient.familyMembers.push(otherFields);
    patient.save();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const linkFamilyMember = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;

    const patient = await patientModel.findOne({ username: username });

    const toBeLinked = await patientModel.findOne({ email: req.body.email });

    const name = toBeLinked.name;
    const gender = toBeLinked.gender;
    const relationship = req.body.relationship;
    console.log(relationship);

    const newMember = { name: name, gender: gender, relation: relationship };
    patient.familyMembers.push(newMember);
    patient.save();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFamilyMembers = async (req, res) => {
  try {
    const patient = await patientModel.findOne({ username: req.body.username });
    const members = patient.familyMembers;
    res.status(200).json({ familyMembers: members });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPrescriptions = async (req, res) => {
  try {
    const filters = {};
    const filterOn = req.body.filterOn;

    // Check for filter parameters in req.body

    if (req.body.date) {
      filters.date = req.body.date;
    }
    if (req.body.doctor) {
      filters.doctor = req.body.doctor;
    }
    if (req.body.filled !== undefined) {
      filters.filled = req.body.filled;
    }
    if (req.body.unfilled !== undefined) {
      filters.unfilled = req.body.unfilled;
    }

    const patient = await patientModel
      .findOne({ username: req.body.username })
      .populate({
        path: "prescriptions",
        populate: {
          path: "doctor",
          model: "Doctor", // The name of the Doctor model
        },
      });

    if (patient) {
      // Filter the prescriptions within the patient's document
      const filteredPrescriptions = patient.prescriptions.filter(
        (prescription) => {
          let matches = true;
          if (!filterOn) return true;

          const mongooseDate = prescription.date;
          const day = String(mongooseDate.getDate()).padStart(2, "0");
          const month = String(mongooseDate.getMonth() + 1).padStart(2, "0");
          const year = mongooseDate.getFullYear();

          const formattedDate = `${day}/${month}/${year}`;

          if (filters.date && formattedDate !== filters.date) {
            matches = false;
          }
          if (filters.doctor && prescription.doctor.name !== filters.doctor) {
            matches = false;
            console.log(prescription.doctor.name, filters.doctor);
          }
          if (
            filters.filled !== null &&
            prescription.filled !== filters.filled
          ) {
            matches = false;
          }
          if (filters.unfilled !== null && prescription.filled == true) {
            console.log(filters.unfilled);
            matches = false;
          }

          return matches;
        }
      );

      res.status(200).json({ prescriptions: filteredPrescriptions });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPatientsFiltered = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;

    const filters = {};
    const filterOn = req.body.filter.filterOn;

    // Check for filter parameters in req.body

    if (req.body.filter.date) {
      filters.date = formatDateString(req.body.filter.date);
    }
    if (req.body.filter.name) {
      filters.name = req.body.filter.name;
    }

    // Get ._Id of doctor from username
    const doctor = await doctorModel.findOne({ username: username });

    let patients = await patientModel.find();

    let appointments = await appointmentModel.find();
    appointments = appointments.filter((appointment) => {
      if (filters.date)
        return (
          appointment.doctor.toString() == doctor._id.toString() &&
          appointment.date.toISOString() == filters.date
        );
      else {
        return appointment.doctor.toString() == doctor._id.toString();
      }
    });

    const patientIds = [];
    appointments.forEach((appointment) => {
      patientIds.push(appointment.patient.toString());
    });

    if (patients) {
      // Filter the doctors within the patient's document

      const filteredPatients = patients.filter((patient) => {
        let matches = true;

        if (!patientIds.includes(patient._id.toString())) return false;

        if (!filterOn) return true;

        if (filters.name && patient.name !== filters.name) {
          matches = false;
        }
        console.log(filters.name, patient.name);
        return matches;
      });

      res.status(200).json({ patients: filteredPatients });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadHealthRecords = async (req, res) => {
  try {
    // Check if token is provided
    const token = req.cookies.token;
    if (!token && !req.body.username) {
      return res.status(403).send("A token is required for authentication");
    }

    // Decode token to get username
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let username = decoded.username;

    if (req.body.username) username = req.body.username;
    console.log(req.body.username);

    // Find the patient by username
    const patient = await patientModel.findOne({ username });
    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    // Process files and update patient record

    const filesToSave = req.files.map((file) => ({
      filename: file.originalname,
      mimetype: file.mimetype,
      data: file.buffer.toString("base64"),
    }));

    patient.files.push(...filesToSave);
    await patient.save();

    res.status(200).send("Files uploaded successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getFile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token && !req.body.username) {
      return res.status(401).send("Access denied. No token provided.");
    }

    let username;

    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      username = decoded.username;
    }
    if (req.body.username) {
      username = req.body.username;
    }

    const { filename } = req.body;

    const patient = await patientModel.findOne({ username });
    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    const file = patient.files.find((f) => f.filename === filename);
    if (!file) {
      return res.status(404).send("File not found");
    }

    // Depending on the file type, you can handle the response differently
    // For example, for images:
    res.json({
      filename: file.filename,
      data: file.buffer,
      mimetype: file.mimetype,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getHealthRecords = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token && !req.body.username) {
      return res.status(401).send("Access denied. No token provided.");
    }

    let username;

    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      username = decoded.username;
    }
    if (req.body.username) {
      username = req.body.username;
    }

    const patient = await patientModel.findOne({ username });
    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    // Assuming each file in patient.files contains filename, mimetype, and buffer
    const records = patient.files.map((file) => ({
      filename: file.filename,
      mimetype: file.mimetype,
      data: file.data.toString("base64"),
    }));

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getWalletP = async (req, res) => {
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

    res.json({ wallet: patient.wallet });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getSubscriptionInfo = async (req, res) => {
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

    const package = await packageModel.findOne({ name: patient.package });

    res.json({ package: package, status: patient.subscriptionStatus });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const subscribePackageWallet = async (req, res) => {
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

    if (patient.wallet < req.body.package.price) {
      return res.status(400).send("Insufficient funds");
    }

    patient.wallet -= req.body.package.price;
    patient.subscriptionStatus = "Subscribed";
    patient.package = req.body.package.name;
    await patient.save();

    res.json({ status: patient.subscriptionStatus });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const cancelSubscription = async (req, res) => {
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

    patient.subscriptionStatus = "Cancelled";
    patient.package = "null";
    await patient.save();

    res.json({ status: patient.subscriptionStatus });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const createCheckoutSession = async (req, res) => {
  console.log(process.env.STRIPE_SECRET_KEY);
  try {
    const { amount } = req.body;
    console.log(amount);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Health Package",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/patient",
      cancel_url: "http://localhost:3000/patient",
    });

    console.log("Session created:", session.id);
    res.send({ sessionId: session.id });
  } catch (e) {
    console.error("Error creating session:", e.message);
    res.status(400).send({ error: e.message });
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
  subscribePackageWallet,
  cancelSubscription,
  createCheckoutSession,
};
