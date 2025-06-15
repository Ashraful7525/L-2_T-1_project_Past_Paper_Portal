// src/pages/UsersPage.jsx
import React, { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/users')
      .then(res => setUsers(res.data.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading users...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h2>👤 Registered Users ({users.length})</h2>
      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Username</th>
            <th style={thStyle}>Profile</th>
            <th style={thStyle}>Contribution</th>
            <th style={thStyle}>Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.student_id} style={user.is_admin ? adminRow : {}}>
              <td style={tdStyle}>{user.student_id}</td>
              <td style={tdStyle}>{user.username}</td>
              <td style={tdStyle}>{user.profile || '-'}</td>
              <td style={tdStyle}>{user.contribution}</td>
              <td style={tdStyle}>{user.is_admin ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const thStyle = {
  borderBottom: '1px solid #ccc',
  textAlign: 'left',
  padding: '0.5rem',
  background: '#f4f4f4',
}

const tdStyle = {
  padding: '0.5rem',
  borderBottom: '1px solid #eee',
}

const adminRow = {
  background: '#f0f9ff',
  fontWeight: 'bold',
}
