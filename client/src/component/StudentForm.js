import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentForm = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    rollno: "",
    phoneno: "",
    email: "",
    subject: [],
  });

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students");

      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update student
        await axios.put(
          `http://localhost:5000/api/students/${editingId}`,
          formData
        );
      } else {
        await axios.post("http://localhost:5000/api/students", formData);
      }
      setFormData({
        name: "",
        class: "",
        rollno: "",
        phoneno: "",
        email: "",
        subject: [],
      });
      setEditingId(null);
      fetchStudents();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      class: student.class,
      rollno: student.rollno,
      phoneno: student.phoneno,
      email: student.email,
      subject: selectedSubject,
    });
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const addSubject = async () => {
    if (selectedStudent && selectedSubject) {
      try {
        const student = students.find((s) => s.name === selectedStudent);
        const subject = subjects.find((s) => s.subjectName === selectedSubject);

        if (!student || !subject) {
          console.error("Selected student or subject not found");
          return;
        }

        await axios.put("http://localhost:5000/api/students/add-subject", {
          studentId: student._id,
          subjectId: subject._id,
        });

        fetchStudents();
      } catch (error) {
        console.error("Error adding subject: ", error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Students Form </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder=" Name"
          required
        />
        <input
          type="number"
          name="class"
          value={formData.class}
          onChange={handleChange}
          placeholder=" Class"
          required
        />
        <input
          type="text"
          name="rollno"
          value={formData.rollno}
          onChange={handleChange}
          placeholder="Roll No"
          required
        />
        <input
          type="number"
          name="phoneno"
          value={formData.phoneno}
          onChange={handleChange}
          placeholder=" Phone No"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <button type="submit">{editingId ? "Update" : "Submit"}</button>
      </form>

      <h2>Student Details</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Roll No</th>
            <th>Phone No</th>
            <th>Email</th>

            <th>Actions</th>
            <th>added Subjects</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.class}</td>
              <td>{student.rollno}</td>
              <td>{student.phoneno}</td>
              <td>{student.email}</td>

              <td>
                <button onClick={() => handleEdit(student)}>Edit</button>
                <button onClick={() => handleDelete(student._id)}>
                  {" "}
                  Delete
                </button>
              </td>
              <td>
                {student.subjects && student.subjects.length > 0
                  ? student.subjects
                      .map((subjectId) => {
                        const subject = subjects.find(
                          (s) => s._id === subjectId
                        );
                        return subject
                          ? subject.subjectName
                          : "Unknown subject";
                      })
                      .join(", ")
                  : "No subjects"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Add Subject to Student</h3>
      <div>
        <select value={selectedStudent} onChange={handleStudentChange}>
          {students.map((student) => (
            <option key={student.id} value={student.name}>
              {student.name}
            </option>
          ))}
        </select>
        <select value={selectedSubject} onChange={handleSubjectChange}>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.subjectName}>
              {subject.subjectName}
            </option>
          ))}
        </select>

        <button onClick={addSubject}>Add Subject</button>
      </div>
    </div>
  );
};

export default StudentForm;
