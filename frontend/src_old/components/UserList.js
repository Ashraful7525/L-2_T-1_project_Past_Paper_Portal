import React, { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data.data || []));
  }, []);

  return (
    <div>
      <h3>Users</h3>
      <ul>
        {users.map(u => (
          <li key={u.student_id}>{u.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
