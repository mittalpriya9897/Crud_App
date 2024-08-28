const express = require("express");
const router = express.Router();
const studentController = require("../controller/studentController");

//student subject route
router.put("/add-subject", studentController.addSubject);

//POST
router.post("/", studentController.createStudent);
//get
router.get("/", studentController.getAllStudents);
//put
router.put("/:id", studentController.updateStudent);
//delete
router.delete("/:id", studentController.deleteStudent);
// GET
router.get("/:student", studentController.getStudent);

module.exports = router;
