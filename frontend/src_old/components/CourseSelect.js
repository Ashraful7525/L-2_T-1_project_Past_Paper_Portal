import React, { useEffect, useState } from "react";

function CourseSelect({ departmentId, onChange }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (departmentId) {
      fetch(`/api/courses?department_id=${departmentId}`)
        .then(res => res.json())
        .then(setCourses);
    } else {
      setCourses([]);
    }
  }, [departmentId]);

  return (
    <select onChange={e => onChange(e.target.value)} disabled={!departmentId}>
      <option value="">Select Course</option>
      {courses.map(course => (
        <option key={course.course_id} value={course.course_id}>
          {course.course_title}
        </option>
      ))}
    </select>
  );
}

export default CourseSelect;
