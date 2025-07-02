// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage    from './pages/HomePage';
import UsersPage   from './pages/UsersPage';
import ClientDashboard from './pages/ClientDashboard';
import SearchResults from './pages/SearchResults';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem' }}>
        <Link to="/">Home</Link> | <Link to="/users">Users</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/search-results" element={<SearchResults />} />
      </Routes>
    </BrowserRouter>
  );
}
