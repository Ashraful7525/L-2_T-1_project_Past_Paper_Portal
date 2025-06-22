import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ClientDashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState({
    level: '',
    term: '',
    department: '',
    course: '',
    year: '',
    questionNo: '',
  });

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  // Fetch departments on load
  useEffect(() => {
    fetch('http://localhost:4000/api/departments')
      .then((res) => res.json())
      .then((data) => {
        //console.log(data)
        // if (Array.isArray(data)) {
        setDepartments(data);
        // } else {
        //   setError('Error: Departments data is not in the expected format.');
        // }
      })
      .catch((error) => setError(`Error fetching departments: ${error.message}`));
  }, []);

  // Fetch courses based on selected department
  useEffect(() => {
    if (search.department) {
      fetch(`http://localhost:4000/api/courses?department_id=${search.department}`)
        .then((res) => res.json())
        .then((data) => setCourses(data))
        .catch((error) => setError(`Error fetching courses: ${error.message}`));
    } else {
      setCourses([]);
    }
  }, [search.department]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      level: search.level || '',
      term: search.term || '',
      department: search.department || '',
      course: search.course || '',
      year: search.year || '',
      questionNo: search.questionNo || '',
    }).toString();
    navigate(`/search-results?${queryParams}`);
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Welcome to Past Paper Portal</h1>
        <button onClick={() => navigate('/profile')}>Go to Profile</button>
      </header>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/questions/your')}
        >
          <h2>Your Questions</h2>
          <p>View and manage your submitted questions</p>
        </div>

        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/solutions/your')}
        >
          <h2>Your Solutions</h2>
          <p>Track and manage your submitted solutions</p>
        </div>

        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <h2>Search Questions</h2>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <select name="level" value={search.level} onChange={handleSearchChange}>
              <option value="">Select Level</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
            </select>

            <select name="term" value={search.term} onChange={handleSearchChange}>
              <option value="">Select Term</option>
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
            </select>

            <select name="department" value={search.department} onChange={handleSearchChange}>
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                  {d.department_name}
                </option>
              ))}
            </select>

            <select name="course" value={search.course} onChange={handleSearchChange}>
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.course_id} value={c.course_id}>
                  {c.course_title}
                </option>
              ))}
            </select>

            <input type="number" name="year" value={search.year} onChange={handleSearchChange} placeholder="Year" />
            <input
              type="number"
              name="questionNo"
              value={search.questionNo}
              onChange={handleSearchChange}
              placeholder="Question No."
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </div>
    </div>
  );
}
