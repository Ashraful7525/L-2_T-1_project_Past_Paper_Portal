import { IconButton, Stack, Typography } from "@mui/material";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useState } from "react";

export default function VoteButtons({ postId }) {
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });

  const vote = (type) => {
    setVotes(v => ({
      ...v,
      upvotes: type === "upvote" ? v.upvotes + 1 : v.upvotes,
      downvotes: type === "downvote" ? v.downvotes + 1 : v.downvotes
    }));
  };

  return (
    <Stack alignItems="center" spacing={0.5} sx={{ py: 1, px: 1, minWidth: 48 }}>
      <IconButton size="small" onClick={() => vote("upvote")} sx={{ color: "#ff4500" }}>
        <FaArrowUp />
      </IconButton>
      <Typography fontWeight={700} color="text.primary">
        {votes.upvotes - votes.downvotes}
      </Typography>
      <IconButton size="small" onClick={() => vote("downvote")} sx={{ color: "#7193ff" }}>
        <FaArrowDown />
      </IconButton>
    </Stack>
  );
}
