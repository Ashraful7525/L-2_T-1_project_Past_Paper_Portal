import React, { useState } from "react";

function CommentForm({ solutionId, studentId, onSuccess }) {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        solution_id: solutionId,
        student_id: studentId,
        comment_text: commentText
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCommentText("");
          setError("");
          onSuccess && onSuccess(data.data);
        } else {
          setError(data.error);
        }
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Add a comment"
        value={commentText}
        onChange={e => setCommentText(e.target.value)}
      />
      <button type="submit">Comment</button>
      {error && <div style={{color:"red"}}>{error}</div>}
    </form>
  );
}

export default CommentForm;
