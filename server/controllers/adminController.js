const adminModel = require("../models/admin");
const patientModel = require("../models/patient");
const doctorModel = require("../models/doctor");
const requestModel = require("../models/request");
const packageModel = require("../models/package");

const addAdmin = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  try {
    const admin = await adminModel.create({
      username,
      email,
      password,
    });
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeAdmin = async (req, res) => {
  const { username } = req.body;
  try {
    const admin = await adminModel.findOneAndDelete({ username: username });
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addAdmin,
  getAdmins,
  removeAdmin,
};
