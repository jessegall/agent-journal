import mimetypes
import shutil
import subprocess
from pathlib import Path

from controllers.types import Messages
from features.base import Feature, event
from resources.base import SYSTEM

MAX_FRAMES = 60


def spacing(seconds: float) -> float:
    return 0.5 if seconds <= 30 else 2 if seconds <= 120 else max(2, seconds / MAX_FRAMES)


def probe(source: Path) -> float:
    try:
        done = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(source)],
            capture_output=True,
            text=True,
            timeout=30,
        )
        return float(done.stdout.strip()) if done.returncode == 0 else 0
    except (OSError, ValueError, subprocess.TimeoutExpired):
        return 0


class Video(Feature):
    name = "video"
    title_ = "Video frames"
    abstract_ = "A video attached to a message is sampled into frames the agent can inspect"
    help_ = "Short clips yield a frame every half second, medium clips every two seconds, and long clips at most sixty frames."

    @event("message.updated")
    def frames(self, event, record) -> None:
        name = str(event.data.get("file") or "")
        if not name or not (mimetypes.guess_type(name)[0] or "").startswith("video/"):
            return
        messages = Messages(record, actor=SYSTEM)
        source = messages.folder(event.n) / name
        row = messages.load(event.n)
        if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
            row.files[name] = "video; ffmpeg and ffprobe are required to extract frames"
            messages.save(row, "updated", video=name, frames=[])
            return
        seconds = probe(source)
        every = spacing(seconds)
        prefix = f"{source.name.replace('.', '-')}-frame-"
        for old in source.parent.glob(f"{prefix}*.jpg"):
            old.unlink()
            row.files.pop(old.name, None)
        target = source.parent / f"{prefix}%04d.jpg"
        try:
            done = subprocess.run(
                ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(source), "-vf", f"fps=1/{every:g}", "-frames:v", str(MAX_FRAMES), "-q:v", "2", str(target)],
                capture_output=True,
                text=True,
                timeout=120,
            )
        except (OSError, subprocess.TimeoutExpired):
            done = None
        frames = sorted(source.parent.glob(f"{prefix}*.jpg")) if done and done.returncode == 0 else []
        row.files[name] = f"video; {len(frames)} frames every {every:g} seconds"
        for frame in frames:
            row.files[frame.name] = f"video frame from {name}"
        messages.save(row, "updated", video=name, frames=[frame.name for frame in frames])
