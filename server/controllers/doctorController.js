const doctorModel = require("../models/doctor");
const appointmentModel = require("../models/appointment");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const getDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeDoctor = async (req, res) => {
  const { username } = req.body;
  try {
    const doctor = await doctorModel.findOneAndDelete({ username: username });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDoctorsFiltered = async (req, res) => {
  try {
    const filters = {};
    const filterOn = req.body.filterOn;

    // Check for filter parameters in req.body

    if (req.body.date) {
      filters.date = formatDateString(req.body.date);
    }
    if (req.body.specialty) {
      filters.specialty = req.body.specialty;
    }
    if (req.body.name) {
      filters.name = req.body.name;
    }

    let doctors = await doctorModel.find();
    let appointments = await appointmentModel.find();
    appointments = appointments.filter((appointment) => {
      return appointment.date.toISOString() == filters.date;
    });

    const doctorIds = [];
    appointments.forEach((appointment) => {
      doctorIds.push(appointment.doctor.toString());
    });

    if (doctors) {
      // Filter the doctors within the patient's document

      const filteredDoctors = doctors.filter((doctor) => {
        let matches = true;

        if (!filterOn) return true;

        if (filters.date && doctorIds.includes(doctor._id.toString())) {
          // Check if the doctor has an appointment on the date from the appointment database
          matches = false;
        }

        if (
          filters.specialty &&
          doctor.education.degree !== filters.specialty
        ) {
          matches = false;
        }
        if (filters.name && doctor.name !== filters.name) {
          matches = false;
        }

        return matches;
      });

      res.status(200).json({ doctors: filteredDoctors });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

function formatDateString(inputDate) {
  // Parse the input date string
  const parsedDate = moment(inputDate, "DD/MM/YYYY HH:mm:ss");

  // Format the date to the desired output format
  const formattedDate = parsedDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  return formattedDate;
}

const modifyDoctor = async (req, res) => {
  const { username, email, hourlyRate, affiliation } = req.body;
  try {
    // Only Update the fields that were actually passed... if they were actually passed
    const updatedData = {};
    if (email) {
      updatedData.email = email;
    }
    if (hourlyRate) {
      updatedData.hourlyRate = hourlyRate;
    }
    if (affiliation) {
      updatedData.affiliation = affiliation;
    }
    // Now update the doctor with the username passed in the request, only update fields in updatedData
    const doctor = await doctorModel.findOneAndUpdate(
      { username: username },
      updatedData,
      { new: true }
    );
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getWalletD = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;

    const doctor = await doctorModel.findOne({ username });
    if (!doctor) {
      return res.status(404).send("Patient not found");
    }

    res.json({ wallet: doctor.wallet });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const acceptContract = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;

    const doctor = await doctorModel.findOne({ username });
    if (!doctor) {
      return res.status(404).send("Patient not found");
    }

    doctor.contract = true;
    await doctor.save();

    res.json({ contract: doctor.contract });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const addAvailableTimeSlot = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const username = decoded.username;

  let { date } = req.body;
  date = formatDateString(date);
  try {
    const doctor = await doctorModel.findOne({ username: username });
    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }

    if (doctor.contract == false) {
      return res.status(400).send("Doctor has not accepted contract");
    }

    const timeSlot = {
      date: date,
    };

    doctor.availableTimeSlots.push(timeSlot);
    await doctor.save();

    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFollowUpRequests = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;

    const doctor = await doctorModel.findOne({ username });
    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }

    res.json({ requests: doctor.followUpRequests });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const acceptFollowUpRequest = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;

    const doctor = await doctorModel.findOne({ username });
    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }

    const { requestId } = req.body;

    const request = doctor.followUpRequests.find(
      (request) => request._id.toString() === requestId
    );

    if (!request) {
      return res.status(404).send("Request not found");
    }

    const appointment = new appointmentModel({
      patient: request.patientId,
      doctor: doctor._id,
      date: request.date,
    });

    await appointment.save();

    doctor.followUpRequests = doctor.followUpRequests.filter(
      (request) => request._id.toString() !== requestId
    );

    await doctor.save();

    res.json({ requests: doctor.followUpRequests });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const rejectFollowUpRequest = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;

    const doctor = await doctorModel.findOne({ username });
    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }

    const { requestId } = req.body;

    doctor.followUpRequests = doctor.followUpRequests.filter(
      (request) => request._id.toString() !== requestId
    );

    await doctor.save();

    res.json({ requests: doctor.followUpRequests });
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
  getDoctors,
  removeDoctor,
  getDoctorsFiltered,
  modifyDoctor,
  getWalletD,
  acceptContract,
  addAvailableTimeSlot,
  getFollowUpRequests,
  acceptFollowUpRequest,
  rejectFollowUpRequest,
};
