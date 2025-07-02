import React, { useEffect, useState } from "react";

function DepartmentSelect({ onChange }) {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetch("/api/departments")
      .then(res => res.json())
      .then(setDepartments);
  }, []);

  return (
    <select onChange={e => onChange(e.target.value)}>
      <option value="">Select Department</option>
      {departments.map(dep => (
        <option key={dep.department_id} value={dep.department_id}>
          {dep.department_name}
        </option>
      ))}
    </select>
  );
}

export default DepartmentSelect;
