import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import SubmitPage from "./pages/SubmitPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/submit" element={<SubmitPage />} />
      </Routes>
    </Router>
  );
}
