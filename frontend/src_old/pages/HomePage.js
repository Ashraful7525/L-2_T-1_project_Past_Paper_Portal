import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Past Paper Portal</h1>
      <nav>
        <ul>
          <li><Link to="/questions">Browse Questions</Link></li>
          <li><Link to="/questions/add">Add Question</Link></li>
          <li><Link to="/solutions/add">Add Solution</Link></li>
          <li><Link to="/users">View Users</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default HomePage;
