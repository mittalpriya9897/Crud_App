const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  employcode: { type: String, required: true },
  phoneno: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model("Teacher", teacherSchema);
