// frontend/src/pages/UsersPage.jsx
import React, { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function UsersPage() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    api.get('/users')
      .then(res => setUsers(res.data.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading users…</p>
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {users.map(u => (
          <li key={u.student_id}>
            <strong>{u.username}</strong> — {u.contribution} pts
          </li>
        ))}
      </ul>
    </div>
  )
}
