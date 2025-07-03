import { Box } from "@mui/material";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import QuestionFilterBar from "../components/QuestionFilterBar";
import PostList from "../components/PostList";

export default function HomePage() {
  const [filters, setFilters] = useState({
    department: "",
    course: "",
    level: "",
    term: "",
    year: "",
    questionNo: ""
  });

  return (
    <Box sx={{ display: "flex", bgcolor: "#dae0e6", minHeight: "100vh" }}>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="container" style={{ marginLeft: 270 }}>
        <QuestionFilterBar filters={filters} setFilters={setFilters} />
        <PostList filters={filters} />
      </div>
    </Box>
  );
}
