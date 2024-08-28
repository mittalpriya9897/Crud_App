const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: Number, required: true },
  rollno: { type: String, required: true },
  phoneno: { type: String, required: true },
  email: { type: String, required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }], 
});

module.exports = mongoose.model("Student", studentSchema);
