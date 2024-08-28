import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const StudentDetail = () => {
  const { student } = useParams();
  const [studentDetail, setStudentDetail] = useState(null);

  useEffect(() => {
    const fetchStudentDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/students/student/${student}`
        );
        setStudentDetail(response.data);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetail();
  }, [student]);

  if (!studentDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Student Details</h2>
      <p>Name: {studentDetail.name}</p>
      <p>Class: {studentDetail.class}</p>
      <p>Roll No: {studentDetail.rollno}</p>
      <p>Phone No: {studentDetail.phoneno}</p>
      <p>Email: {studentDetail.email}</p>
    </div>
  );
};

export default StudentDetail;
