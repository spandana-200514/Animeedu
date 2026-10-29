import React, { useEffect, useState } from "react";
import { generateLessonAnimation } from "../services/api.js";
import Loader from "../components/Loader.jsx";

const LANGUAGES = [
  "English",
  "Kannada",
  "Hindi",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Punjabi",
];

const TONES = ["Friendly", "Professional", "Energetic", "Calm", "Teacher Style", "Storytelling"];

const STEPS = [
  "Analyzing lesson content",
  "Creating educational script",
  "Preparing animation scenes",
  "Adding selected character",
  "Generating voice narration",
  "Synchronizing subtitles",
  "Rendering video",
  "Finalizing educational animation",
];

function AnimationPreview() {
  const [character, setCharacter] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [language, setLanguage] = useState("English");
  const [voiceTone, setVoiceTone] = useState("Friendly");
  const [subtitles, setSubtitles] = useState(true);
  const [multilingual, setMultilingual] = useState(false);
  const [duration, setDuration] = useState(30);
  const [quality, setQuality] = useState("720p");
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setCharacter(JSON.parse(localStorage.getItem("animeedu_character") || "null"));
      setLesson(JSON.parse(localStorage.getItem("animeedu_lesson") || "null"));
    } catch (err) {
      setCharacter(null);
    }
  }, []);

  const generateVideo = async () => {
    setError("");
    setGenerating(true);
    setVideoUrl("");
    setProgress(8);
    setStep(0);
    let current = 8;
    const timer = setInterval(() => {
      current = Math.min(current + 6, 88);
      setProgress(current);
      setStep(Math.min(STEPS.length - 1, Math.floor(current / 12)));
    }, 700);
    try {
      const payload = {
        topic: lesson?.topic || "Machine Learning",
        character: character?.name || "AI Teacher",
        language,
        voice_tone: voiceTone,
        summary: lesson?.summary || "",
        duration: Number(duration),
        quality,
        subtitles,
        multilingual,
        animation_style: character?.animation_style || "Classroom",
        background_style: character?.background_style || "Soft Gradient",
      };
      const result = await generateLessonAnimation(payload);
      clearInterval(timer);
      setProgress(100);
      setStep(STEPS.length - 1);
      const path = result?.data?.video_path || `/generated/videos/${result?.data?.filename}`;
      setVideoUrl(`http://localhost:8000${path}`);
    } catch (err) {
      clearInterval(timer);
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Video generation failed. Confirm the backend is running on port 8000.";
      setError(typeof message === "string" ? message : "Video generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Animation Preview</p>
          <h1>Generate an educational video</h1>
        </div>
      </div>
      {error ? <div className="alert error">{error}</div> : null}
      <div className="split">
        <section className="panel">
          <h3>Selected character</h3>
          <div className="selected-character">
            <div className="avatar">{character?.emoji || "👩‍🏫"}</div>
            <div>
              <strong>{character?.name || "AI Teacher"}</strong>
              <p>{character?.category || "Teachers"}</p>
            </div>
          </div>
          <label>
            Language
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {LANGUAGES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Voice tone
            <select value={voiceTone} onChange={(e) => setVoiceTone(e.target.value)}>
              {TONES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Animation duration (seconds)
            <input type="number" min="20" max="90" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </label>
          <label>
            Video quality
            <select value={quality} onChange={(e) => setQuality(e.target.value)}>
              <option>480p</option>
              <option>720p</option>
              <option>1080p</option>
            </select>
          </label>
          <label className="checkbox">
            <input type="checkbox" checked={subtitles} onChange={(e) => setSubtitles(e.target.checked)} />
            Enable subtitles
          </label>
          <label className="checkbox">
            <input type="checkbox" checked={multilingual} onChange={(e) => setMultilingual(e.target.checked)} />
            Multi-language option
          </label>
          <button className="primary-btn" type="button" onClick={generateVideo} disabled={generating}>
            Generate Educational Video
          </button>
        </section>
        <section className="panel">
          {generating ? (
            <div>
              <h3>{STEPS[step]}</h3>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p>{progress}% complete</p>
              <Loader label="Rendering your classroom animation..." />
            </div>
          ) : null}
          {videoUrl ? (
            <div>
              <h3>Your Educational Video is Ready!</h3>
              <video controls autoPlay src={videoUrl}>
                Your browser does not support video playback.
              </video>
              <p className="muted">{videoUrl}</p>
            </div>
          ) : !generating ? (
            <p className="muted">Configure language and voice, then generate a playable MP4.</p>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export default AnimationPreview;
