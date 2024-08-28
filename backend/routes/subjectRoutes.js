const express = require("express");
const router = express.Router();
const subjectController = require("../controller/subjectController");

router.get("/", subjectController.getSubject);

router.post("/", subjectController.createSubject);

router.put("/:id", subjectController.updateSubject);

router.delete("/:id", subjectController.deleteSubject);

module.exports = router;
