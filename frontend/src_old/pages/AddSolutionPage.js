import React, { useState } from "react";
import SolutionForm from "../components/SolutionForm";

function AddSolutionPage() {
  // For demo, you may want to select questionId and studentId dynamically
  const [questionId, setQuestionId] = useState("");
  const [studentId, setStudentId] = useState("");

  return (
    <div>
      <h2>Add a Solution</h2>
      <input
        type="number"
        placeholder="Question ID"
        value={questionId}
        onChange={e => setQuestionId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Your Student ID"
        value={studentId}
        onChange={e => setStudentId(e.target.value)}
      />
      <SolutionForm
        questionId={questionId}
        studentId={studentId}
        onSuccess={() => alert("Solution submitted!")}
      />
    </div>
  );
}

export default AddSolutionPage;
