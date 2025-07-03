import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";

export default function CommentList({ solutionId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`/api/comments?solution_id=${solutionId}`)
      .then(res => res.json())
      .then(setComments);
  }, [solutionId]);

  return (
    <Box sx={{ mt: 1, mb: 1 }}>
      {comments.map(comment => (
        <Typography key={comment.comment_id} sx={{ mb: 0.5, fontSize: 14, color: "#555" }}>
          {comment.comment_text}
        </Typography>
      ))}
    </Box>
  );
}
