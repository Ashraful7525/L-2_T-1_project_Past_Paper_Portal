import React, { useState } from "react";

function QuestionForm({ onSuccess }) {
  const [form, setForm] = useState({
    question_no: "",
    question_text: "",
    course_id: "",
    level: "",
    term: "",
    year: ""
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setError("");
          setForm({
            question_no: "",
            question_text: "",
            course_id: "",
            level: "",
            term: "",
            year: ""
          });
          onSuccess && onSuccess(data.data);
        } else {
          setError(data.error);
        }
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="question_no" placeholder="Question No" value={form.question_no} onChange={handleChange} />
      <input name="question_text" placeholder="Question Text" value={form.question_text} onChange={handleChange} />
      <input name="course_id" placeholder="Course ID" value={form.course_id} onChange={handleChange} />
      <input name="level" placeholder="Level" value={form.level} onChange={handleChange} />
      <input name="term" placeholder="Term" value={form.term} onChange={handleChange} />
      <input name="year" placeholder="Year" value={form.year} onChange={handleChange} />
      <button type="submit">Add Question</button>
      {error && <div style={{color:"red"}}>{error}</div>}
    </form>
  );
}

export default QuestionForm;
