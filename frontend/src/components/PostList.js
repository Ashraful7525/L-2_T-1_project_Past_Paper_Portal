import { useEffect, useState } from "react";
import PostCard from "./PostCard";

export default function PostList({ filters }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    fetch(`/api/questions/search?${params.toString()}`)
      .then(res => res.json())
      .then(setPosts);
  }, [filters]);

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.question_id} post={post} />
      ))}
    </div>
  );
}
