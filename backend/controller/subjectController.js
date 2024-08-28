const Subject = require("../model/Subjects");
const logger = require("../logger");

exports.getSubject = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    logger.error("Error retrieving subjects", {
      meta: { req, res },
      error: err,
    });
    res.status(500).json({ message: err.message });
  }
};

exports.createSubject = async (req, res) => {
  const { subjectName } = req.body;

  if (
    !subjectName ||
    typeof subjectName !== "string" ||
    subjectName.trim().length === 0
  ) {
    return res.status(400).json({
      message: "Subject name is required and must be a non-empty string",
    });
  }

  const subject = new Subject({ subjectName: subjectName.trim() });

  try {
    const newSubject = await subject.save();
    logger.info("Subject created successfully", { meta: { req, res } });
    res.status(201).json(newSubject);
  } catch (err) {
    logger.error("Error creating subject", { meta: { req, res }, error: err });
    res.status(400).json({ message: err.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const { subjectName } = req.body;
    if (
      subjectName &&
      (typeof subjectName !== "string" || subjectName.trim().length === 0)
    ) {
      return res
        .status(400)
        .json({ message: "Subject name must be a non-empty string" });
    }

    if (subjectName) {
      subject.subjectName = subjectName.trim();
    }

    const updatedSubject = await subject.save();
    logger.info("Subject updated successfully", { meta: { req, res } });
    res.json(updatedSubject);
  } catch (err) {
    logger.error("Error updating subject", { meta: { req, res }, error: err });
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await subject.remove();
    logger.info("Subject deleted successfully", { meta: { req, res } });
    res.json({ message: "Subject deleted" });
  } catch (err) {
    logger.error("Error deleting subject", { meta: { req, res }, error: err });
    res.status(500).json({ message: err.message });
  }
};
