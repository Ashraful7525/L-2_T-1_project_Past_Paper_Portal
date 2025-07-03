import { TextField, MenuItem, Stack, Paper } from "@mui/material";
import { useEffect, useState } from "react";

export default function QuestionFilterBar({ filters, setFilters }) {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [levels, setLevels] = useState([]);
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    fetch("/api/departments").then(res => res.json()).then(setDepartments);
    fetch("/api/levels").then(res => res.json()).then(setLevels);
    fetch("/api/terms").then(res => res.json()).then(setTerms);
  }, []);

  useEffect(() => {
    if (filters.department) {
      fetch(`/api/courses?department_id=${filters.department}`)
        .then(res => res.json())
        .then(setCourses);
    } else {
      setCourses([]);
    }
  }, [filters.department]);

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        bgcolor: "#f6f7f8",
        overflowX: "auto",
        width: "100%",
        minWidth: 0,
      }}
      className="card"
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          minWidth: 700,
          flexWrap: "nowrap",
          alignItems: "center",
        }}
      >
        <TextField
          select
          label="Department"
          value={filters.department}
          onChange={e => setFilters(f => ({ ...f, department: e.target.value, course: "" }))}
          size="small"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          {departments.map(dep => (
            <MenuItem key={dep.department_id} value={dep.department_id}>
              {dep.department_name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Course"
          value={filters.course}
          onChange={e => setFilters(f => ({ ...f, course: e.target.value }))}
          size="small"
          sx={{ minWidth: 140 }}
          disabled={!filters.department}
        >
          <MenuItem value="">All</MenuItem>
          {courses.map(course => (
            <MenuItem key={course.course_id} value={course.course_id}>
              {course.course_title}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Level"
          value={filters.level}
          onChange={e => setFilters(f => ({ ...f, level: e.target.value }))}
          size="small"
          sx={{ minWidth: 100 }}
        >
          <MenuItem value="">All</MenuItem>
          {levels.map(level => (
            <MenuItem key={level.level} value={level.level}>
              {level.level}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Term"
          value={filters.term}
          onChange={e => setFilters(f => ({ ...f, term: e.target.value }))}
          size="small"
          sx={{ minWidth: 100 }}
        >
          <MenuItem value="">All</MenuItem>
          {terms.map(term => (
            <MenuItem key={term.term} value={term.term}>
              {term.term}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Year"
          type="number"
          value={filters.year}
          onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
          size="small"
          sx={{ width: 100 }}
        />
        <TextField
          label="Question No"
          type="number"
          value={filters.questionNo}
          onChange={e => setFilters(f => ({ ...f, questionNo: e.target.value }))}
          size="small"
          sx={{ width: 140 }}
        />
      </Stack>
    </Paper>
  );
}
