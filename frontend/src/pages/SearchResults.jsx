import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SearchResults() {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      const query = new URLSearchParams(location.search);  // Parse the search parameters from the URL
      const params = query.toString();

      try {
        const response = await fetch(`/api/questions/search?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setQuestions(data);  // Set the questions to state
        } else {
          setError('Search results are not in the expected format.');
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
      }
      setLoading(false);
    };

    fetchResults();
  }, [location.search]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (questions.length === 0) {
    return <p>No results found for the given search criteria.</p>;
  }

  return (
    <div>
      <h2>Search Results</h2>
      <div>
        {questions.map((question) => (
          <div key={question.question_id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd' }}>
            <h3>Question {question.question_no}</h3>
            <p>{question.question_text}</p>
            <p>Course ID: {question.course_id}, Semester ID: {question.semester_id}, Year: {question.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
