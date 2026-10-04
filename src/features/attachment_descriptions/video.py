import subprocess
from pathlib import Path

MAX_FRAMES = 60
VIDEO = "video/"
TAGGED = "video; "


def spacing(seconds: float) -> float:
    if seconds <= 30:
        return 0.5
    return 2 if seconds <= 120 else max(2, seconds / MAX_FRAMES)


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


def frame_prefix(source: Path) -> str:
    return f"{source.name.replace('.', '-')}-frame-"


def frames_of(source: Path) -> list[Path]:
    return sorted(source.parent.glob(f"{frame_prefix(source)}*.jpg"))


def sampled(source: Path, every: float) -> tuple[list[Path], str]:
    try:
        done = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(source), "-vf", f"fps=1/{every:g}", "-frames:v", str(MAX_FRAMES),
                               "-q:v", "2", str(source.parent / f"{frame_prefix(source)}%04d.jpg")], capture_output=True, text=True, timeout=120)
    except (OSError, subprocess.TimeoutExpired) as error:
        done = subprocess.CompletedProcess([], -1, "", str(error))
    if done.returncode == 0:
        return frames_of(source), ""
    errors = (done.stderr or "").strip().splitlines()
    return [], errors[-1] if errors else "ffmpeg failed"
