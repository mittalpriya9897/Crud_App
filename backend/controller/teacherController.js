const Teacher = require("../model/Teacher");
const Student = require("../model/Student");
const logger = require("../logger");

exports.createTeacher = async (req, res) => {
  try {
    const { name, subject, email } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Name, subject, and email are required" });
    }

    const teacher = new Teacher(req.body);
    await teacher.save();

    logger.info("Teacher created successfully", { meta: { req, res } });
    res.status(201).json(teacher);
  } catch (error) {
    logger.error("Error creating teacher", { meta: { req, res }, error });
    res.status(400).json({ message: error.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { name, subject, email } = req.body;

    //validation
    if (name && typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    }
    if (subject && typeof subject !== "string") {
      return res.status(400).json({ message: "Subject must be a string" });
    }
    if (email && typeof email !== "string") {
      return res.status(400).json({ message: "Email must be a string" });
    }

    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    logger.info("Teacher updated successfully", { meta: { req, res } });
    res.json(teacher);
  } catch (error) {
    logger.error("Error updating teacher", { meta: { req, res }, error });
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    logger.info("Teacher deleted successfully", { meta: { req, res } });
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    logger.error("Error deleting teacher", { meta: { req, res }, error });
    res.status(500).json({ message: error.message });
  }
};

exports.addStudentToTeacher = async (req, res) => {
  const { teacherId, studentId } = req.body;

  if (!teacherId || !studentId) {
    return res
      .status(400)
      .json({ message: "Teacher ID and Student ID are required" });
  }

  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find  Student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!teacher.students.includes(studentId)) {
      teacher.students.push(studentId);
      await teacher.save();
    }

    logger.info("Student added to teacher successfully", {
      meta: { req, res },
    });
    return res.status(200).json(teacher);
  } catch (error) {
    logger.error("Error adding student to teacher", {
      meta: { req, res },
      error,
    });
    return res.status(500).json({
      message: "Error adding student to teacher",
      error: error.message,
    });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("students");
    res.json(teachers);
  } catch (error) {
    logger.error("Error retrieving all teachers", {
      meta: { req, res },
      error,
    });
    res.status(500).json({ message: error.message });
  }
};
