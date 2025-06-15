// src/pages/HomePage.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="homepage">
      <h1>🎓 Past Paper Portal</h1>
      <p>
        Welcome to the ultimate academic hub for sharing and discovering university past papers,
        solutions, and resources.
      </p>

      <div className="home-links">
        <Link to="/users">👤 View Users</Link>
        <Link to="/departments">🏫 Browse Departments</Link>
        <Link to="/questions">❓ Explore Questions</Link>
      </div>

      <footer>
        <p>Made with 💻 using React, Express & Supabase</p>
      </footer>
    </div>
  )
}
