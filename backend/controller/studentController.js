const Student = require("../model/Student");
const Subject = require("../model/Subjects");
const logger = require("../logger");

//post
exports.createStudent = async (req, res) => {
  try {
    const {
      name,
      class: studentClass,
      rollno,
      phoneno,
      email,
      subjects,
    } = req.body;

    if (!name || !studentClass || !rollno || !phoneno || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = new Student(req.body);
    await student.save();

    logger.info("Student created successfully", { meta: { req, res } });
    res.status(201).json(student);
  } catch (error) {
    logger.error("Error creating student", { meta: { req, res }, error });
    res.status(400).json({ message: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    logger.error("Error retrieving all students", {
      meta: { req, res },
      error,
    });
    res.status(500).json({ message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, //
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    logger.info("Student updated successfully", { meta: { req, res } });
    res.json(student);
  } catch (error) {
    logger.error("Error updating student", { meta: { req, res }, error });
    res.status(400).json({ message: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    logger.info("Student deleted successfully", { meta: { req, res } });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    logger.error("Error deleting student", { meta: { req, res }, error });
    res.status(500).json({ message: error.message });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const studentName = req.params.student;
    const studentDetail = await Student.findOne({ name: studentName });
    if (!studentDetail) {
      return res.status(404).json({ message: "Student not found" });
    }

    logger.info("Student retrieved successfully", { meta: { req, res } });
    res.json(studentDetail);
  } catch (error) {
    logger.error("Error fetching student details", {
      meta: { req, res },
      error,
    });
    res.status(500).json({ message: error.message });
  }
};

exports.addSubject = async (req, res) => {
  const { studentId, subjectId } = req.body;

  if (!studentId || !subjectId) {
    return res
      .status(400)
      .json({ message: "Student ID and Subject ID are required" });
  }

  try {
    //fin student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find subject
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (!student.subjects.includes(subjectId)) {
      student.subjects.push(subjectId);
      await student.save();
    }

    logger.info("Subject added to student successfully", {
      meta: { req, res },
    });
    return res.status(200).json(student);
  } catch (error) {
    logger.error("Error adding subject to student", {
      meta: { req, res },
      error,
    });
    return res.status(500).json({
      message: "Error adding subject to student",
      error: error.message,
    });
  }
};
