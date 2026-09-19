import json
import os
import shutil
import statistics
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from urllib.request import urlopen

from controllers.types import CONTROLLERS
from engine.record import Record

HERE = Path(__file__).resolve().parents[1]

COMMANDS = (("start",), ("status",), ("message", "all"), ("message", "unread"), ("todo", "all"), ("work", "all"))
TYPES = ("message", "todo", "work", "comment", "notification", "agent", "question", "reaction")
PATHS = ("/api/summary", "/api/manifest", "/api/{env}/message", "/api/{env}/todo", "/api/{env}/comment", "/api/{env}/notification", "/api/{env}/events?since=0")


def timed(fn, runs: int) -> float:
    took = []
    for _ in range(runs):
        began = time.perf_counter()
        fn()
        took.append(time.perf_counter() - began)
    return statistics.median(took) * 1000


def copy(root: Path) -> Path:
    target = Path(tempfile.mkdtemp()) / ".journal"
    shutil.copytree(root, target, ignore=lambda folder, names: [n for n in names if n.startswith("printed-") or n in ("src", "attic")])
    return target


def cli(root: Path, env: str, argv: tuple, runs: int) -> float:
    command = [sys.executable, str(HERE / "journal.py"), "--root", str(root), "--env", env, *argv]
    return timed(lambda: subprocess.run(command, capture_output=True, timeout=120, env={**os.environ, "AGENT_JOURNAL_ACTIVE": ""}), runs)


def hook(root: Path, runs: int) -> float:
    payload = json.dumps({"hook_event_name": "PreToolUse", "session_id": "speed-probe", "tool_name": "Read", "tool_input": {"file_path": "README.md"}})
    command = [sys.executable, str(HERE / "hook.py"), "claude", str(root)]
    return timed(lambda: subprocess.run(command, input=payload, capture_output=True, text=True, timeout=120, cwd=root.parent, env={**os.environ, "AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ENV": "main"}), runs)


def viewer(root: Path) -> str:
    try:
        return json.loads((root / "runtime" / "viewer.json").read_text())["url"].rstrip("/")
    except (OSError, ValueError, KeyError):
        return ""


def measure(live: Path, env: str, runs: int = 5, url: str = "", out: str = "") -> str:
    live = Path(live).resolve()
    scratch = copy(live)
    rows = {}
    record = Record(scratch, env)
    for type_ in TYPES:
        folder = record.folder(type_, CONTROLLERS[type_].resource.scope)
        count = len(list(folder.glob("[0-9][0-9][0-9].md")))
        rows[f"list {type_} ({count})"] = timed(lambda: CONTROLLERS[type_](record).all(), runs)
    for argv in COMMANDS:
        rows[f"journal {' '.join(argv)}"] = cli(scratch, env, argv, runs)
    rows["hook PreToolUse"] = hook(scratch, runs)
    base = url.rstrip("/") or viewer(live)
    for path in PATHS if base else ():
        address = base + path.format(env=env)
        rows[f"GET {path}"] = timed(lambda: urlopen(address, timeout=30).read(), runs)
    shutil.rmtree(scratch.parent, ignore_errors=True)
    rows["runtime/ MB"] = sum(f.stat().st_size for f in (live / "runtime").rglob("*") if f.is_file()) / 1e6
    if out:
        Path(out).write_text(json.dumps({"at": time.time(), "viewer": base, "runs": runs, "median_ms": rows}, indent=2))
    width = max(len(k) for k in rows)
    return "\n".join(f"{name:<{width}}  {value:9.1f}" for name, value in rows.items())
