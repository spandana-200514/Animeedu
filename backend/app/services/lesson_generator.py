import re
from collections import Counter


STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "if", "in", "on", "for", "to", "of", "is", "are",
    "was", "were", "be", "been", "with", "as", "by", "at", "from", "that", "this", "it",
    "its", "their", "they", "we", "you", "your", "our", "can", "will", "may", "not",
}


def split_sentences(text: str):
    parts = re.split(r"(?<=[.!?])\s+", (text or "").strip())
    return [p.strip() for p in parts if len(p.strip()) > 20]


def tokenize(text: str):
    return [w for w in re.findall(r"[A-Za-z][A-Za-z0-9_+#]*", (text or "").lower()) if w not in STOPWORDS]


def extractive_summary(text: str, max_sentences: int = 4) -> str:
    sentences = split_sentences(text)
    if not sentences:
        return (text or "")[:400]
    freq = Counter(tokenize(text))
    ranked = []
    for sentence in sentences:
        score = sum(freq.get(w, 0) for w in tokenize(sentence))
        ranked.append((score, sentence))
    ranked.sort(key=lambda x: x[0], reverse=True)
    selected = [s for _, s in ranked[:max_sentences]]
    selected.sort(key=lambda s: sentences.index(s))
    return " ".join(selected)


def key_phrases(text: str, limit: int = 8):
    words = tokenize(text)
    common = [w.title() for w, _ in Counter(words).most_common(limit)]
    return common or ["Core Concept", "Application", "Practice"]


def generate_lesson(topic: str, subject: str, difficulty: str, mode: str, content: str):
    source = (content or "").strip()
    if len(source) < 40:
        source = (
            f"{topic} is an important topic in {subject}. Students at the {difficulty} level "
            f"should understand the core idea, why it matters, and how it is used in real life. "
            f"{topic} can be learned through definitions, examples, and step-by-step practice. "
            f"A {mode.lower()} learning mode helps students remember the concept longer. "
            f"Start with a simple explanation, then move to applications, common mistakes, and revision questions."
        )
    summary = extractive_summary(source, 4)
    concepts = key_phrases(source + " " + topic, 6)
    points = [
        f"Definition: {topic} explained in simple language for {difficulty} learners.",
        f"Why it matters in {subject} and in practical problem solving.",
        "Break the topic into smaller ideas and connect them with examples.",
        "Practice with questions, code, or diagrams depending on the subject.",
        "Revise weak areas and explain the topic in your own words.",
    ]
    examples = [
        f"Classroom example: a teacher introduces {topic} using a daily-life analogy.",
        f"Applied example: how {topic} is used in {subject} projects.",
        f"Exam example: a short question that checks whether the student understood {topic}.",
    ]
    explanation = (
        f"Think of {topic} as a building block in {subject}. First learn what it is, then why it exists, "
        f"then how to use it. In {mode.lower()} mode, focus on memorable scenes, characters, and short steps. "
        f"If a part feels difficult, slow down and connect it to something you already know."
    )
    return {
        "topic": topic,
        "subject": subject,
        "difficulty": difficulty,
        "mode": mode,
        "summary": summary,
        "concepts": concepts,
        "key_points": points,
        "examples": examples,
        "explanation": explanation,
        "source_text": source,
    }
