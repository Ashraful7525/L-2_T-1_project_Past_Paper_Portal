import React, { useState } from "react";

function VoteButton({ solutionId, studentId, onVoted }) {
  const [error, setError] = useState("");

  function handleVote(type) {
    fetch(`/api/solutions/${solutionId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: studentId,
        vote_type: type
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setError("");
          onVoted && onVoted();
        } else {
          setError(data.error);
        }
      });
  }

  return (
    <div>
      <button onClick={() => handleVote("upvote")}>Upvote</button>
      <button onClick={() => handleVote("downvote")}>Downvote</button>
      {error && <span style={{color:"red"}}>{error}</span>}
    </div>
  );
}

export default VoteButton;
