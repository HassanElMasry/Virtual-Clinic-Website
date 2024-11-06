const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  doctorDiscount: {
    type: Number,
    required: true,
  },
  medicineDiscount: {
    type: Number,
    required: true,
  },
  familyDiscount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Package", packageSchema);
