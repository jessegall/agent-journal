import json
import time
from pathlib import Path

from engine import runtime
from engine.stored import read_json, write_json

COUNTDOWN = 10.0
CHECK_EVERY = 0.25
STATE = "update-countdown.json"


def state(root: Path) -> Path:
    return runtime.folder(root) / STATE


def remaining(root: Path) -> dict:
    """The automatic update counting down, with the seconds it has left, or nothing when none is."""
    held = read_json(state(root), dict, {})
    seconds = float(held.get("until", 0)) - time.time()
    return {"version": held["version"], "seconds": max(0, round(seconds))} if held.get("version") and seconds > -1 else {}


def cancel(root: Path) -> None:
    state(root).unlink(missing_ok=True)


def wait(root: Path, version: str, seconds: float = COUNTDOWN, every: float = CHECK_EVERY) -> bool:
    """Counts down before an automatic update and says whether it runs: false when it was cancelled meanwhile."""
    write_json(state(root), {"version": version, "until": time.time() + seconds})
    until = time.time() + seconds
    while time.time() < until:
        if read_json(state(root), dict, {}).get("version") != version:
            return False
        time.sleep(every)
    cancel(root)
    return True
