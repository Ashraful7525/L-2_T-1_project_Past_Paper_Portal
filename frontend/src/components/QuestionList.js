import React, { useEffect, useState } from "react";

function QuestionList({ filters }) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    fetch(`/api/questions/search?${params.toString()}`)
      .then(res => res.json())
      .then(setQuestions);
  }, [filters]);

  return (
    <div>
      <ul>
        {questions.map(q => (
          <li key={q.question_id}>
            {q.question_text} (Year: {q.year})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionList;
