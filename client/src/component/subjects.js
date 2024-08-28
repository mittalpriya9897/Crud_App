import React, { useState, useEffect } from "react";
import axios from "axios";

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    subjectName: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update subject
        await axios.put(
          `http://localhost:5000/api/subjects/${editingId}`,
          formData
        );
      } else {
        // Add new subject
        await axios.post("http://localhost:5000/api/subjects", formData);
      }
      setFormData({
        subjectName: "",
      });
      setEditingId(null);
      fetchSubjects();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (subject) => {
    setFormData({
      subjectName: subject.subjectName,
    });
    setEditingId(subject._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/subjects/${id}`);
      fetchSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  return (
    <div className="App">
      <h1>Subjects Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="subjectName">Enter Subject</label>
        <input
          type="text"
          name="subjectName"
          value={formData.subjectName}
          onChange={handleChange}
          placeholder="Subject"
          required
        />
        <button type="submit">{editingId ? "Update" : "Submit"}</button>
      </form>

      <h2>Subject List</h2>
      <ul>
        {subjects.map((subject) => (
          <li key={subject._id}>
            {subject.subjectName}
            <button onClick={() => handleEdit(subject)}>Edit</button>
            <button onClick={() => handleDelete(subject._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubjectList;
