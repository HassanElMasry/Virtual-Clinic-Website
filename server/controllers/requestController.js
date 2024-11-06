const requestModel = require("../models/request");
const doctorModel = require("../models/doctor");

const submitDoctorRequest = async (req, res) => {
  console.log(req.body);
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
    const request = await requestModel.create({
      username,
      name,
      email,
      hourlyRate,
      password,
      dob,
      affiliation,
      education,
    });
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await requestModel.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const acceptRequest = async (req, res) => {
  const { username } = req.body;
  try {
    const request = await requestModel.findOneAndDelete({ username: username });
    const doctor = await doctorModel.create({
      username: request.username,
      name: request.name,
      email: request.email,
      hourlyRate: request.hourlyRate,
      password: request.password,
      dob: request.dob,
      affiliation: request.affiliation,
      education: request.education,
      files: request.files,
    });
    doctor.save();
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeRequest = async (req, res) => {
  const { username } = req.body;
  try {
    const request = await requestModel.findOneAndDelete({ username: username });
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  submitDoctorRequest,
  getRequests,
  acceptRequest,
  removeRequest,
};
