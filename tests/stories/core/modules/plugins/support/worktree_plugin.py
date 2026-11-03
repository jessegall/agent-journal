import json
import sys
from pathlib import Path

PROGRAM = '''import json
import os
import sys
from pathlib import Path

event = json.load(sys.stdin)
data = event["data"]
if event["event"] == "worker_delivering":
    (Path(os.environ["JOURNAL_PLUGIN_DATA"]) / "delivery.json").write_text(json.dumps(data))
    root = Path(data["worktree"])
    assert data["base"]
    paths = data["files"]
else:
    root = Path(data["cwd"])
    paths = [data["path"]]
for name in paths:
    path = root / name
    if "items=[]" in path.read_text():
        reason = f"{path}: mutable default"
        if event["event"] == "worker_delivering":
            print(json.dumps({"v": 1, "answer": "refuse", "reason": reason}))
        else:
            print(json.dumps({"v": 1, "tell": reason}))
        break
'''


def worktree_plugin_folder(parent: Path) -> Path:
    folder = parent / "worktree-plugin"
    folder.mkdir()
    (folder / "journal-plugin.json").write_text(json.dumps({
        "name": "worktree-judge", "title": "Worktree judge", "version": "1.0.0", "protocol": 1,
        "program": "run.sh", "hears": ["file_edited", "worker_delivering"],
        "reaches": {"file_edited": ["workers"]}, "holds": [{"event": "worker_delivering", "window_ms": 5000}],
    }))
    (folder / "judge.py").write_text(PROGRAM)
    program = folder / "run.sh"
    program.write_text(f'#!/bin/sh\nexec "{sys.executable}" judge.py\n')
    program.chmod(0o755)
    return folder
