import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";

export default function CommentForm({ solutionId, studentId, onSuccess }) {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        solution_id: solutionId,
        student_id: studentId,
        comment_text: commentText
      })
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setCommentText("");
      onSuccess && onSuccess(data.data);
      alert("Comment posted!");
    } else {
      alert(data.error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <TextField
          label="Add a comment"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          size="small"
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Comment
        </Button>
      </Stack>
    </form>
  );
}
