import re
from app.services.lesson_generator import key_phrases, split_sentences


QUESTION_BANK = {
    "definition": "What is the best starting point to understand {topic}?",
    "importance": "Why is {topic} important for learners?",
    "practice": "Which approach helps students remember {topic} better?",
    "mistake": "What is a common mistake when studying {topic}?",
    "application": "Where is {topic} commonly applied?",
}


def generate_quiz(topic: str, difficulty: str, content: str, count: int = 5):
    phrases = key_phrases((content or "") + " " + topic, 6)
    sentences = split_sentences(content or "")
    questions = []
    templates = [
        {
            "question": QUESTION_BANK["definition"].format(topic=topic),
            "options": [
                f"A clear definition of {topic} with a simple example",
                "Memorizing random formulas only",
                "Skipping the basics and jumping to advanced papers",
                "Ignoring practice questions",
            ],
            "answer": 0,
            "skill": "Fundamentals",
        },
        {
            "question": QUESTION_BANK["importance"].format(topic=topic),
            "options": [
                "It has no practical value",
                f"It builds a foundation for later {topic} applications",
                "It is only useful for trivia",
                "It should be avoided in exams",
            ],
            "answer": 1,
            "skill": "Conceptual understanding",
        },
        {
            "question": QUESTION_BANK["practice"].format(topic=topic),
            "options": [
                "Cramming the night before without examples",
                "Watching unrelated videos only",
                "Using explanations, examples, quizzes, and revision",
                "Never testing yourself",
            ],
            "answer": 2,
            "skill": "Study method",
        },
        {
            "question": QUESTION_BANK["mistake"].format(topic=topic),
            "options": [
                "Connecting ideas with real examples",
                "Checking weak areas after a quiz",
                "Learning only keywords without meaning",
                "Explaining the topic in simple language",
            ],
            "answer": 2,
            "skill": "Common errors",
        },
        {
            "question": QUESTION_BANK["application"].format(topic=topic),
            "options": [
                "Only in fictional stories",
                f"In academic work and real {difficulty.lower()} projects",
                "Never in engineering",
                "Only in sports",
            ],
            "answer": 1,
            "skill": "Application",
        },
    ]
    if phrases:
        templates.append(
            {
                "question": f"Which idea is most closely related to {topic}?",
                "options": [
                    phrases[0],
                    "Unrelated historical dates",
                    "Random punctuation rules",
                    "Sports league rankings",
                ],
                "answer": 0,
                "skill": "Key concepts",
            }
        )
    if sentences:
        snippet = sentences[0][:90]
        templates.append(
            {
                "question": f"Based on the lesson, which statement fits {topic} best?",
                "options": [
                    snippet,
                    "The topic has no definition.",
                    "Students should skip examples.",
                    "Quizzes never help memory.",
                ],
                "answer": 0,
                "skill": "Comprehension",
            }
        )
    for index, item in enumerate(templates[: max(3, min(count, len(templates)))]):
        questions.append(
            {
                "id": index + 1,
                "question": item["question"],
                "options": item["options"],
                "answer": item["answer"],
                "skill": item["skill"],
            }
        )
    return questions


def evaluate_quiz(topic: str, answers, questions):
    total = len(questions or [])
    score = 0
    skill_hits = {}
    skill_miss = {}
    for i, question in enumerate(questions or []):
        selected = answers[i] if i < len(answers) else -1
        skill = question.get("skill", "General")
        if selected == question.get("answer"):
            score += 1
            skill_hits[skill] = skill_hits.get(skill, 0) + 1
        else:
            skill_miss[skill] = skill_miss.get(skill, 0) + 1
    percentage = round((score / total) * 100, 1) if total else 0
    strengths = list(skill_hits.keys()) or ["Consistent attempt"]
    weak = list(skill_miss.keys()) or ["No major weak area detected"]
    if percentage >= 80:
        rec = f"Excellent work on {topic}. Move to advanced applications and a mini project."
    elif percentage >= 60:
        rec = f"Good progress on {topic}. Revise weak areas and generate an animated lesson for memory."
    else:
        rec = f"Rebuild the basics of {topic} with a simpler lesson, then retake a short quiz."
    return {
        "score": score,
        "total": total,
        "percentage": percentage,
        "strengths": strengths,
        "weak_areas": weak,
        "recommendation": rec,
    }
