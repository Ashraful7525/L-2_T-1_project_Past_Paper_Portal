import { Paper, CardContent, Typography, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import VoteButtons from "./VoteButtons";

export default function PostCard({ post }) {
  return (
    <Paper
      component={Link}
      to={`/post/${post.question_id}`}
      elevation={2}
      sx={{
        mb: 2,
        borderRadius: 2,
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
        cursor: "pointer",
        width: "100%",
        textDecoration: "none",
        "&:hover": { boxShadow: "0 4px 16px 0 rgba(0,0,0,0.12)" }
      }}
    >
      <Stack direction="row" alignItems="flex-start">
        <VoteButtons postId={post.question_id} />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {post.question_text}
          </Typography>
          <Typography color="text.secondary" fontSize={14}>
            Year: {post.year} | Course: {post.course_id}
          </Typography>
        </CardContent>
      </Stack>
    </Paper>
  );
}
