import subprocess
from pathlib import Path

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
