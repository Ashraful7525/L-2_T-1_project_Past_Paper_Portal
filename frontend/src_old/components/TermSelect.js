import React, { useEffect, useState } from "react";

function TermSelect({ onChange }) {
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    fetch("/api/terms")
      .then(res => res.json())
      .then(setTerms)
      .catch(() => setTerms([]));
  }, []);

  return (
    <select onChange={e => onChange(e.target.value)}>
      <option value="">Select Term</option>
      {terms.map(termObj =>
        <option key={termObj.term} value={termObj.term}>
          {termObj.term}
        </option>
      )}
    </select>
  );
}

export default TermSelect;
