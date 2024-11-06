const packageModel = require("../models/package");

const getPackages = async (req, res) => {
  try {
    const packages = await packageModel.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addPackage = async (req, res) => {
  const { name, price, doctorDiscount, medicineDiscount, familyDiscount } =
    req.body;
  try {
    const package = await packageModel.create({
      name,
      price,
      doctorDiscount,
      medicineDiscount,
      familyDiscount,
    });
    res.status(200).json(package);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePackage = async (req, res) => {
  const { name, price, doctorDiscount, medicineDiscount, familyDiscount } =
    req.body;
  try {
    const package = await packageModel.findOneAndUpdate(
      { name: name },
      { price, doctorDiscount, medicineDiscount, familyDiscount }
    );
    res.status(200).json(package);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePackage = async (req, res) => {
  const { name } = req.body;
  try {
    const package = await packageModel.findOneAndDelete({ name: name });
    res.status(200).json(package);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getPackages, addPackage, updatePackage, deletePackage };
