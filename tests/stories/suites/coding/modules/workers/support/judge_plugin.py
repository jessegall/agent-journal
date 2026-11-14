import json
import sys
from pathlib import Path

SINFUL_TEXT = "items=[]\n"
PLUGIN_NAME = "judge"
JUDGED_EVENTS = ("worker_delivering", "worker_merging")

PROGRAM = '''import json
import os
import sys
from pathlib import Path

event = json.load(sys.stdin)
data = event["data"]
(Path(os.environ["JOURNAL_PLUGIN_DATA"]) / f"{event['event']}.json").write_text(json.dumps(data))
for name in data["files"]:
    path = Path(data["worktree"]) / name
    if path.is_file() and "items=[]" in path.read_text():
        print(json.dumps({"v": 1, "answer": "refuse", "reason": f"{name} has a sin"}))
        break
'''


def judge_plugin_folder(parent: Path) -> Path:
    folder = parent / "judge-plugin"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "journal-plugin.json").write_text(json.dumps({
        "name": PLUGIN_NAME, "title": "Judge", "version": "1.0.0", "protocol": 1, "program": "run.sh",
        "hears": list(JUDGED_EVENTS), "holds": [{"event": event, "window_ms": 5000} for event in JUDGED_EVENTS],
    }))
    (folder / "judge.py").write_text(PROGRAM)
    program = folder / "run.sh"
    program.write_text(f'#!/bin/sh\nexec "{sys.executable}" judge.py\n')
    program.chmod(0o755)
    return folder


def judged_data(story, event: str = JUDGED_EVENTS[0]) -> dict[str, object]:
    return json.loads((story.home.folder / f"plugin-data/{PLUGIN_NAME}/{event}.json").read_text())


def judged_files(story, event: str = JUDGED_EVENTS[0]) -> list[str]:
    return sorted(judged_data(story, event)["files"])
