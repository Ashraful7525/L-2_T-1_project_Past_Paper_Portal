import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper, Divider } from "@mui/material";
import Sidebar from "../components/Sidebar";
import SolutionForm from "../components/SolutionForm";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

const STUDENT_ID = 1; // Replace with actual user ID if you have auth

export default function PostPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/questions/${id}`).then(res => res.json()),
      fetch(`/api/solutions?question_id=${id}`).then(res => res.json())
    ])
      .then(([questionData, solutionsData]) => {
        setQuestion(questionData);
        setSolutions(Array.isArray(solutionsData) ? solutionsData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const refreshSolutions = () => {
    fetch(`/api/solutions?question_id=${id}`)
      .then(res => res.json())
      .then(data => {
        setSolutions(Array.isArray(data) ? data : []);
      });
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ display: "flex", bgcolor: "#dae0e6", minHeight: "100vh" }}>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="container" style={{ marginLeft: 270 }}>
        <Paper className="card" sx={{ mb: 3 }}>
          {question && question.question_text ? (
            <>
              <Typography variant="h5" fontWeight={700} color="primary" mb={1}>
                {question.question_text}
              </Typography>
              <Typography color="text.secondary" mb={1}>
                Year: {question.year} | Course: {question.course_id}
              </Typography>
              <Divider sx={{ my: 2 }} />
            </>
          ) : (
            <Typography color="error">Question not found.</Typography>
          )}

          <Typography variant="h6" mb={1}>Add Your Solution</Typography>
          <SolutionForm questionId={id} studentId={STUDENT_ID} onSuccess={refreshSolutions} />
        </Paper>

        <Typography variant="h6" mb={2}>All Solutions</Typography>
        {solutions.length === 0 && (
          <Paper className="card" sx={{ mb: 2 }}>
            <Typography>No solutions yet. Be the first to contribute!</Typography>
          </Paper>
        )}
        {solutions.map(solution => (
          <Paper key={solution.solution_id} className="card" sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>{solution.solution_text}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              By Student #{solution.student_id}
            </Typography>
            <CommentList solutionId={solution.solution_id} />
            <CommentForm solutionId={solution.solution_id} studentId={STUDENT_ID} onSuccess={() => {}} />
          </Paper>
        ))}
      </div>
    </Box>
  );
}
