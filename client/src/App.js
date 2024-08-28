// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentForm from "./component/StudentForm";
import NotFound from "./component/NotFound";
import TeacherForm from "./component/TeacherForm";
import StudentDetail from "./component/StudentDetail";
import SubjectList from "./component/subjects";

function App() {
  return (
    //all routes
    <Router>
      <Routes>
        <Route path="student/:student" element={<StudentDetail />} />
        <Route path="/" element={<StudentForm />} />
        <Route path="/teacherForm" element={<TeacherForm />} />
        <Route path="/subjectList" element={<SubjectList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
