import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";

export default function PostForm({ onSuccess }) {
  const [form, setForm] = useState({
    question_no: "",
    question_text: "",
    course_id: "",
    level: "",
    term: "",
    year: ""
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setForm({
        question_no: "",
        question_text: "",
        course_id: "",
        level: "",
        term: "",
        year: ""
      });
      onSuccess && onSuccess(data.data);
      alert("Question posted!");
    } else {
      alert(data.error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField label="Question No" name="question_no" value={form.question_no} onChange={handleChange} fullWidth required />
        <TextField label="Question Text" name="question_text" value={form.question_text} onChange={handleChange} fullWidth required multiline />
        <TextField label="Course ID" name="course_id" value={form.course_id} onChange={handleChange} fullWidth required />
        <TextField label="Level" name="level" value={form.level} onChange={handleChange} fullWidth required />
        <TextField label="Term" name="term" value={form.term} onChange={handleChange} fullWidth required />
        <TextField label="Year" name="year" value={form.year} onChange={handleChange} fullWidth required />
        <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
          Post Question
        </Button>
      </Stack>
    </form>
  );
}
