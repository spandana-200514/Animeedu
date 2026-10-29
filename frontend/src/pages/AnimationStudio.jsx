import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CHARACTER_LIBRARY } from "./CharacterStudio.jsx";

function AnimationStudio() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("Teachers");
  const [characterId, setCharacterId] = useState("t1");
  const [style, setStyle] = useState("Classroom");
  const [background, setBackground] = useState("Soft Gradient");

  const characters = CHARACTER_LIBRARY.filter((item) => item.category === category);

  const continueNext = () => {
    const character = CHARACTER_LIBRARY.find((item) => item.id === characterId) || CHARACTER_LIBRARY[0];
    localStorage.setItem(
      "animeedu_character",
      JSON.stringify({ ...character, animation_style: style, background_style: background })
    );
    navigate("/animation-preview");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Animation Studio</p>
          <h1>Configure your educational animation</h1>
        </div>
      </div>
      <section className="panel form-grid">
        <label>
          Character category
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              const first = CHARACTER_LIBRARY.find((item) => item.category === e.target.value);
              setCharacterId(first?.id || "");
            }}
          >
            {[
              "Teachers",
              "Students",
              "Engineers",
              "Scientists",
              "Doctors",
              "Cartoon Characters",
              "Professional",
              "Kids",
            ].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Animation style
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option>Classroom</option>
            <option>Storyboard</option>
            <option>Whiteboard</option>
            <option>Cartoon scene</option>
          </select>
        </label>
        <label>
          Background style
          <select value={background} onChange={(e) => setBackground(e.target.value)}>
            <option>Soft Gradient</option>
            <option>Campus</option>
            <option>Lab</option>
            <option>Night study</option>
          </select>
        </label>
      </section>
      <div className="card-grid">
        {characters.map((character) => (
          <button
            key={character.id}
            type="button"
            className={characterId === character.id ? "character-card selected" : "character-card"}
            onClick={() => {
              setCharacterId(character.id);
              localStorage.setItem("animeedu_character", JSON.stringify(character));
            }}
          >
            <div className="avatar">{character.emoji}</div>
            <h4>{character.name}</h4>
            <p>{character.category}</p>
            <span>{characterId === character.id ? "Selected" : "Select"}</span>
          </button>
        ))}
      </div>
      <button className="primary-btn" type="button" onClick={continueNext}>
        Continue to Video Settings
      </button>
    </div>
  );
}

export default AnimationStudio;
