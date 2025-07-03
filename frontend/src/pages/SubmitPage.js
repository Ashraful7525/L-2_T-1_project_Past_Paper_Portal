import Sidebar from "../components/Sidebar";
import PostForm from "../components/PostForm";

export default function SubmitPage() {
  return (
    <div style={{ display: "flex", background: "#dae0e6", minHeight: "100vh" }}>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="container" style={{ marginLeft: 270 }}>
        <div className="card" style={{ maxWidth: 500, margin: "2rem auto" }}>
          <h2 style={{ color: "#ff4500", marginBottom: 24, fontWeight: 700 }}>Submit a Question</h2>
          <PostForm />
        </div>
      </div>
    </div>
  );
}
