import React, { useState } from "react";

function SolutionForm({ questionId, studentId, onSuccess }) {
  const [solutionText, setSolutionText] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    fetch("/api/solutions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: questionId,
        student_id: studentId,
        solution_text: solutionText
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSolutionText("");
          setError("");
          onSuccess && onSuccess(data.data);
        } else {
          setError(data.error);
        }
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Your solution"
        value={solutionText}
        onChange={e => setSolutionText(e.target.value)}
      />
      <button type="submit">Submit Solution</button>
      {error && <div style={{color:"red"}}>{error}</div>}
    </form>
  );
}

export default SolutionForm;
