import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherForm = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    students: [],
    employcode: "",
    phoneno: "",
    email: "",
    student: [],
  });

  const [editTeacherId, setEditTeacherId] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "students" ? value.split(",").map((s) => s.trim()) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/teachers", formData);
      setFormData({
        name: "",
        // students: [],
        employcode: "",
        phoneno: "",
        email: "",
      });
      fetchTeachers();
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/teachers/${id}`);
      fetchTeachers();
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  const handleEdit = (teacher) => {
    setFormData({
      name: teacher.name,
      students: teacher.students.map((student) => student._id),
      employcode: teacher.employcode,
      phoneno: teacher.phoneno,
      email: teacher.email,
    });
    setEditTeacherId(teacher._id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/teachers/${editTeacherId}`,
        formData
      );
      setFormData({
        name: "",
        employcode: "",
        phoneno: "",
        email: "",
      });
      setEditTeacherId(null);
      fetchTeachers();
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedTeacher || !selectedStudent) {
      console.error("Please select both a teacher and a student.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/teachers/add-student",
        {
          teacherId: selectedTeacher,
          studentId: selectedStudent,
        }
      );

      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher._id === response.data._id ? response.data : teacher
        )
      );

      setSelectedTeacher("");
      setSelectedStudent("");
      fetchTeachers();
    } catch (error) {
      console.error(
        "Error adding student to teacher:",
        error.response?.data || error.message
      );
      setError("Failed to add student to teacher. Please try again.");
    }
  };

  return (
    <div className="App">
      <h1>Teachers Record</h1>
      <form onSubmit={editTeacherId ? handleUpdate : handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />

        <input
          type="text"
          name="employcode"
          value={formData.employcode}
          onChange={handleChange}
          placeholder="Employee Code"
          required
        />
        <input
          type="number"
          name="phoneno"
          value={formData.phoneno}
          onChange={handleChange}
          placeholder="Phone No"
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

        <button type="submit">{editTeacherId ? "Update" : "Submit"}</button>
      </form>

      <h2>Teacher Details</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Students</th>
            <th>Employee Code</th>
            <th>Phone No</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher._id}>
              <td>{teacher.name}</td>
              <td>
                {teacher.students?.map((student) => (
                  <span key={student._id}>
                    {student.name}
                    <br />
                  </span>
                ))}
              </td>
              <td>{teacher.employcode}</td>
              <td>{teacher.phoneno}</td>
              <td>{teacher.email}</td>
              <td>
                <button onClick={() => handleEdit(teacher)}>Edit</button>
                <button onClick={() => handleDelete(teacher._id)}>
                  {" "}
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h2>Add Student to Teacher</h2>
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
        >
          <option value="">Select Teacher</option>
          {teachers?.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Select Student</option>
          {students?.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name}
            </option>
          ))}
        </select>

        <button onClick={handleAddStudent}>Add Student</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default TeacherForm;
