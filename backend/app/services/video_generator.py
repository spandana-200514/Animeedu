import os
import uuid
from datetime import datetime

from gtts import gTTS
from PIL import Image, ImageDraw, ImageFont
import numpy as np


VIDEO_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "generated", "videos")
os.makedirs(VIDEO_DIR, exist_ok=True)

LANG_CODES = {
    "English": "en",
    "Kannada": "kn",
    "Hindi": "hi",
    "Tamil": "ta",
    "Telugu": "te",
    "Malayalam": "ml",
    "Marathi": "mr",
    "Bengali": "bn",
    "Gujarati": "gu",
    "Punjabi": "pa",
}

TITLES = {
    "English": ["Welcome to AnimeEdu", "Today's topic", "Key idea", "Remember this", "Quick example", "Practice tip", "Summary"],
    "Kannada": ["AnimeEdu ಗೆ ಸ್ವಾಗತ", "ಇಂದಿನ ವಿಷಯ", "ಮುಖ್ಯ ಕಲ್ಪನೆ", "ಇದನ್ನು ನೆನಪಿಡಿ", "ಉದಾಹರಣೆ", "ಅಭ್ಯಾಸ", "ಸಾರಾಂಶ"],
    "Hindi": ["AnimeEdu में आपका स्वागत है", "आज का विषय", "मुख्य विचार", "याद रखें", "उदाहरण", "अभ्यास", "सारांश"],
    "Tamil": ["AnimeEduக்கு வரவேற்கிறோம்", "இன்றைய பாடம்", "முக்கிய கருத்து", "நினைவில் கொள்க", "எடுத்துக்காட்டு", "பயிற்சி", "சுருக்கம்"],
    "Telugu": ["AnimeEduకు స్వాగతం", "నేటి అంశం", "ముఖ్య ఆలోచన", "గుర్తుంచుకోండి", "ఉదాహరణ", "అభ్యాసం", "సారాంశం"],
    "Malayalam": ["AnimeEdu-ലേക്ക് സ്വാഗതം", "ഇന്നത്തെ വിഷയം", "പ്രധാന ആശയം", "ഓർക്കുക", "ഉദാഹരണം", "പരിശീലനം", "സംഗ്രഹം"],
    "Marathi": ["AnimeEdu मध्ये स्वागत", "आजचा विषय", "मुख्य कल्पना", "लक्षात ठेवा", "उदाहरण", "सराव", "सारांश"],
    "Bengali": ["AnimeEdu-তে স্বাগতম", "আজকের বিষয়", "মূল ধারণা", "মনে রাখুন", "উদাহরণ", "অনুশীলন", "সারাংশ"],
    "Gujarati": ["AnimeEduમાં સ્વાગત", "આજનો વિષય", "મુખ્ય વિચાર", "યાદ રાખો", "ઉદાહરણ", "અભ્યાસ", "સારાંશ"],
    "Punjabi": ["AnimeEdu ਵਿੱਚ ਸੁਆਗਤ", "ਅੱਜ ਦਾ ਵਿਸ਼ਾ", "ਮੁੱਖ ਵਿਚਾਰ", "ਯਾਦ ਰੱਖੋ", "ਉਦਾਹਰਨ", "ਅਭਿਆਸ", "ਸਾਰ"],
}


def _font(size: int, bold: bool = False):
    candidates = []
    windir = os.environ.get("WINDIR", r"C:\Windows")
    candidates.extend(
        [
            os.path.join(windir, "Fonts", "arialbd.ttf" if bold else "arial.ttf"),
            os.path.join(windir, "Fonts", "segoeui.ttf"),
            os.path.join(windir, "Fonts", "Nirmala.ttf"),
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ]
    )
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


def _wrap(draw, text, font, max_width):
    words = (text or "").split()
    lines, current = [], ""
    for word in words:
        test = (current + " " + word).strip()
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines[:8]


def _avatar_color(name: str):
    palette = [(37, 99, 235), (14, 165, 233), (79, 70, 229), (16, 185, 129), (245, 158, 11), (236, 72, 153)]
    return palette[sum(ord(c) for c in name) % len(palette)]


def _draw_slide(width, height, title, body, character, step, total, tone, language):
    img = Image.new("RGB", (width, height), (8, 28, 58))
    draw = ImageDraw.Draw(img)
    for y in range(height):
        mix = y / max(height - 1, 1)
        r = int(8 + (37 - 8) * mix)
        g = int(28 + (99 - 28) * mix)
        b = int(58 + (235 - 58) * 0.35 * mix)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    draw.rounded_rectangle([48, 48, width - 48, height - 48], radius=36, fill=(255, 255, 255))
    draw.rounded_rectangle([48, 48, width - 48, 150], radius=36, fill=(37, 99, 235))
    draw.rectangle([48, 120, width - 48, 150], fill=(37, 99, 235))
    title_font = _font(36, True)
    body_font = _font(28)
    small = _font(20)
    draw.text((80, 72), "AnimeEdu  |  AI Animated Learning", font=small, fill=(219, 234, 254))
    cx, cy, rad = 160, 250, 58
    color = _avatar_color(character or "Teacher")
    draw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=color)
    initial = (character or "A")[:1].upper()
    draw.text((cx - 14, cy - 22), initial, font=_font(40, True), fill=(255, 255, 255))
    draw.text((240, 214), character or "AI Teacher", font=_font(30, True), fill=(15, 23, 42))
    draw.text((240, 258), f"{tone} voice  ·  {language}", font=small, fill=(71, 85, 105))
    draw.text((80, 340), title, font=title_font, fill=(15, 23, 42))
    y = 400
    for line in _wrap(draw, body, body_font, width - 200):
        draw.text((80, y), line, font=body_font, fill=(51, 65, 85))
        y += 42
    bar_x, bar_y, bar_w = 80, height - 110, width - 160
    draw.rounded_rectangle([bar_x, bar_y, bar_x + bar_w, bar_y + 16], radius=8, fill=(226, 232, 240))
    fill_w = int(bar_w * (step / max(total, 1)))
    draw.rounded_rectangle([bar_x, bar_y, bar_x + fill_w, bar_y + 16], radius=8, fill=(37, 99, 235))
    draw.text((80, height - 86), f"Scene {step}/{total}", font=small, fill=(100, 116, 139))
    return img


def _make_narration(topic, character, language, voice_tone, summary):
    titles = TITLES.get(language, TITLES["English"])
    script = (
        f"{titles[0]}. {titles[1]}: {topic}. "
        f"{character} will explain this in a {voice_tone.lower()} voice. "
        f"{summary or topic} "
        f"{titles[-1]}: keep practicing {topic} with examples and a short quiz."
    )
    return script[:450]


def generate_educational_video(payload: dict):
    topic = payload.get("topic") or "Machine Learning"
    character = payload.get("character") or "AI Teacher"
    language = payload.get("language") or "English"
    voice_tone = payload.get("voice_tone") or "Friendly"
    summary = payload.get("summary") or f"{topic} is explained with simple scenes, examples, and revision tips."
    duration = int(payload.get("duration") or 30)
    quality = payload.get("quality") or "720p"
    width, height = (1280, 720) if quality != "1080p" else (1920, 1080)

    titles = TITLES.get(language, TITLES["English"])
    bodies = [
        f"{character} is ready to teach {topic}.",
        f"We will learn {topic} step by step.",
        summary,
        f"A {voice_tone.lower()} explanation makes {topic} easier to remember.",
        f"Imagine a real classroom where {character} uses pictures and stories.",
        f"Pause, repeat, and try one example related to {topic}.",
        f"You can now generate a quiz and ask the AI tutor about {topic}.",
    ]
    scene_count = min(len(titles), len(bodies))
    seconds_each = max(2.0, duration / scene_count)
    fps = 8
    frames_each = max(8, int(seconds_each * fps))

    frames = []
    for i in range(scene_count):
        slide = _draw_slide(width, height, titles[i], bodies[i], character, i + 1, scene_count, voice_tone, language)
        arr = np.array(slide)
        for _ in range(frames_each):
            frames.append(arr)

    video_id = uuid.uuid4().hex[:12]
    filename = f"lesson_{video_id}.mp4"
    output_path = os.path.join(VIDEO_DIR, filename)
    audio_path = os.path.join(VIDEO_DIR, f"voice_{video_id}.mp3")

    try:
        tts = gTTS(text=_make_narration(topic, character, language, voice_tone, summary), lang=LANG_CODES.get(language, "en"))
        tts.save(audio_path)
    except Exception:
        audio_path = None

    try:
        from moviepy import ImageSequenceClip, AudioFileClip
    except Exception:
        from moviepy.editor import ImageSequenceClip, AudioFileClip

    clip = ImageSequenceClip(frames, fps=fps)
    if audio_path and os.path.exists(audio_path):
        try:
            audio = AudioFileClip(audio_path)
            clip = clip.with_audio(audio) if hasattr(clip, "with_audio") else clip.set_audio(audio)
        except Exception:
            pass
    write_kwargs = {"codec": "libx264", "audio_codec": "aac", "logger": None}
    try:
        clip.write_videofile(output_path, **write_kwargs)
    except TypeError:
        clip.write_videofile(output_path, codec="libx264", audio_codec="aac")
    finally:
        clip.close()
        if audio_path and os.path.exists(audio_path):
            try:
                os.remove(audio_path)
            except OSError:
                pass

    return {
        "video_id": video_id,
        "filename": filename,
        "video_path": f"/generated/videos/{filename}",
        "created_at": datetime.utcnow().isoformat(),
    }
