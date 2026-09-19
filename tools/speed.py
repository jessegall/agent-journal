import argparse
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

HERE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HERE))
from controllers.types import CONTROLLERS  # noqa: E402
from engine.record import Record  # noqa: E402

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


def main(argv: list[str]) -> int:
    ask = argparse.ArgumentParser(description="Time what users wait on in a journal record")
    ask.add_argument("--root", default=str(HERE / ".journal"))
    ask.add_argument("--env", default="main")
    ask.add_argument("--runs", type=int, default=5)
    ask.add_argument("--url", default="")
    ask.add_argument("--out", default="")
    args = ask.parse_args(argv)
    live = Path(args.root).resolve()
    scratch = copy(live)
    rows = {}
    record = Record(scratch, args.env)
    for type_ in TYPES:
        folder = record.folder(type_, CONTROLLERS[type_].resource.scope)
        count = len(list(folder.glob("[0-9][0-9][0-9].md")))
        rows[f"list {type_} ({count})"] = timed(lambda: CONTROLLERS[type_](record).all(), args.runs)
    for argv_ in COMMANDS:
        rows[f"journal {' '.join(argv_)}"] = cli(scratch, args.env, argv_, args.runs)
    rows["hook PreToolUse"] = hook(scratch, args.runs)
    base = args.url.rstrip("/") or viewer(live)
    for path in PATHS if base else ():
        url = base + path.format(env=args.env)
        rows[f"GET {path}"] = timed(lambda: urlopen(url, timeout=30).read(), args.runs)
    shutil.rmtree(scratch.parent, ignore_errors=True)
    runtime = sum(f.stat().st_size for f in (live / "runtime").rglob("*") if f.is_file())
    rows["runtime/ MB"] = runtime / 1e6
    width = max(len(k) for k in rows)
    for name, value in rows.items():
        print(f"{name:<{width}}  {value:9.1f}")
    if args.out:
        Path(args.out).write_text(json.dumps({"at": time.time(), "viewer": base, "runs": args.runs, "median_ms": rows}, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
