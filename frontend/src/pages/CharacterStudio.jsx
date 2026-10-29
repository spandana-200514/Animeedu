import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const CHARACTER_LIBRARY = [
  { id: "t1", name: "AI Teacher", category: "Teachers", emoji: "👩‍🏫" },
  { id: "t2", name: "Prof. Quantum", category: "Teachers", emoji: "👨‍🏫" },
  { id: "s1", name: "Asha the Scholar", category: "Students", emoji: "🎓" },
  { id: "s2", name: "Rohan Learner", category: "Students", emoji: "📘" },
  { id: "e1", name: "Circuit Engineer", category: "Engineers", emoji: "🛠️" },
  { id: "e2", name: "Code Captain", category: "Engineers", emoji: "💻" },
  { id: "sc1", name: "Dr. Nova", category: "Scientists", emoji: "🔬" },
  { id: "sc2", name: "Lab Luna", category: "Scientists", emoji: "🧪" },
  { id: "d1", name: "Dr. Care", category: "Doctors", emoji: "🩺" },
  { id: "d2", name: "Nurse Pixel", category: "Doctors", emoji: "💊" },
  { id: "c1", name: "Sparky Fox", category: "Cartoon Characters", emoji: "🦊" },
  { id: "c2", name: "Buddy Bot", category: "Cartoon Characters", emoji: "🤖" },
  { id: "p1", name: "Mentor Maya", category: "Professional", emoji: "💼" },
  { id: "p2", name: "Coach Arjun", category: "Professional", emoji: "📊" },
  { id: "k1", name: "Tiny Star", category: "Kids", emoji: "⭐" },
  { id: "k2", name: "Rainbow Kid", category: "Kids", emoji: "🌈" },
];

const CATEGORIES = [
  "Teachers",
  "Students",
  "Engineers",
  "Scientists",
  "Doctors",
  "Cartoon Characters",
  "Professional",
  "Kids",
];

function CharacterStudio() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("Teachers");
  const [selected, setSelected] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("animeedu_character") || "null");
    } catch (error) {
      return null;
    }
  });

  const visible = useMemo(
    () => CHARACTER_LIBRARY.filter((item) => item.category === category),
    [category]
  );

  const choose = (character) => {
    setSelected(character);
    localStorage.setItem("animeedu_character", JSON.stringify(character));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Character Studio</p>
          <h1>Choose who teaches the lesson</h1>
        </div>
      </div>
      <div className="chip-row">
        {CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            className={item === category ? "chip active" : "chip"}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="card-grid">
        {visible.map((character) => (
          <button
            key={character.id}
            type="button"
            className={selected?.id === character.id ? "character-card selected" : "character-card"}
            onClick={() => choose(character)}
          >
            <div className="avatar">{character.emoji}</div>
            <h4>{character.name}</h4>
            <p>{character.category}</p>
            <span>{selected?.id === character.id ? "Selected" : "Select"}</span>
          </button>
        ))}
      </div>
      <button
        className="primary-btn"
        type="button"
        disabled={!selected}
        onClick={() => navigate("/animation-preview")}
      >
        Continue to Video Settings
      </button>
    </div>
  );
}

export default CharacterStudio;
