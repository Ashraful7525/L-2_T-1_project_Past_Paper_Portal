import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";

export default function SolutionForm({ questionId, studentId, onSuccess }) {
  const [solutionText, setSolutionText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/solutions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: questionId,
        student_id: studentId,
        solution_text: solutionText
      })
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setSolutionText("");
      onSuccess && onSuccess(data.data);
      alert("Solution posted!");
    } else {
      alert(data.error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Your Solution"
          value={solutionText}
          onChange={e => setSolutionText(e.target.value)}
          multiline
          minRows={2}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Submit Solution
        </Button>
      </Stack>
    </form>
  );
}
