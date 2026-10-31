import json
from pathlib import Path

PROGRAM = """#!/bin/sh
line=$(cat)
case "$line" in
  *'"worker_delivering"'*'"cart.py"'*) echo '{"v": 1, "answer": "refuse", "reason": "cart.py has a sin"}' ;;
  *'"worker_merging"'*'"cart.py"'*) echo '{"v": 1, "answer": "refuse", "reason": "cart.py is not judged yet"}' ;;
esac
"""


def step_plugin_folder(parent: Path, event_name: str) -> Path:
    folder = parent / "steps-plugin"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "journal-plugin.json").write_text(json.dumps({"name": "steps", "title": "Steps", "version": "1.0.0", "protocol": 1, "program": "run.sh",
                                                             "hears": [event_name], "holds": [{"event": event_name, "window_ms": 5000}]}))
    (folder / "run.sh").write_text(PROGRAM)
    (folder / "run.sh").chmod(0o755)
    return folder
