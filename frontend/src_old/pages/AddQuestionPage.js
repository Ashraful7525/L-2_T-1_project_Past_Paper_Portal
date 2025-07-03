import React from "react";
import QuestionForm from "../components/QuestionForm";

function AddQuestionPage() {
  return (
    <div>
      <h2>Add a New Question</h2>
      <QuestionForm onSuccess={q => alert("Question added!")} />
    </div>
  );
}

export default AddQuestionPage;
