    const express = require("express");
    const router = express.Router();
    const teacherController = require("../controller/teacherController");

    //add student to teacher
    router.put("/add-student", teacherController.addStudentToTeacher);

    router.post("/", teacherController.createTeacher);

    //get

    router.get("/", teacherController.getAllTeachers);

    // PUT
    router.put("/:id", teacherController.updateTeacher);

    // DELETE
    router.delete("/:id", teacherController.deleteTeacher);

    module.exports = router;
