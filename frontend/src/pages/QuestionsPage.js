import React, { useState } from "react";
import DepartmentSelect from "../components/DepartmentSelect";
import CourseSelect from "../components/CourseSelect";
import LevelSelect from "../components/LevelSelect";
import TermSelect from "../components/TermSelect";
import QuestionList from "../components/QuestionList";

function QuestionsPage() {
  const [filters, setFilters] = useState({
    department: "",
    course: "",
    level: "",
    term: "",
    year: "",
    questionNo: ""
  });

  return (
    <div>
      <h2>Questions</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <DepartmentSelect onChange={d => setFilters(f => ({ ...f, department: d }))} />
        <CourseSelect departmentId={filters.department} onChange={c => setFilters(f => ({ ...f, course: c }))} />
        <LevelSelect onChange={l => setFilters(f => ({ ...f, level: l }))} />
        <TermSelect onChange={t => setFilters(f => ({ ...f, term: t }))} />
        <input
          type="number"
          placeholder="Year"
          value={filters.year}
          onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Question No"
          value={filters.questionNo}
          onChange={e => setFilters(f => ({ ...f, questionNo: e.target.value }))}
        />
      </div>
      <QuestionList filters={filters} />
    </div>
  );
}

export default QuestionsPage;
