import React, { useEffect, useState } from "react";

function LevelSelect({ onChange }) {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    fetch("/api/levels")
      .then(res => res.json())
      .then(setLevels)
      .catch(() => setLevels([]));
  }, []);

  return (
    <select onChange={e => onChange(e.target.value)}>
      <option value="">Select Level</option>
      {levels.map(levelObj =>
        <option key={levelObj.level} value={levelObj.level}>
          {levelObj.level}
        </option>
      )}
    </select>
  );
}

export default LevelSelect;
