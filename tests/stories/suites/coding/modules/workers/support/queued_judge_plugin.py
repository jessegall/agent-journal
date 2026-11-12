import json
from pathlib import Path

PLUGIN_NAME = "queuing"
KIND = "judge"
PROCESSES = [{"kind": KIND, "title": "Judging the hand-in", "category": "check", "at_once": "judge_at_once"}]
SETTINGS = [{"key": "judge_at_once", "title": "Judges at once", "kind": "number", "default": 1, "help": "How many judges may run at once"}]


def queue_answer(script: Path) -> str:
    return json.dumps({"v": 1, "answer": "queue", "run": {"kind": KIND, "command": ["sh", str(script)]}})


def judge_script(parent: Path, body: str, name: str = "judge.sh") -> Path:
    """The command a plugin queues: it runs the shell text given, in the checkout of the agent that handed in."""
    script = parent / name
    script.write_text(body)
    return script


def queuing_plugin_folder(parent: Path, script: Path, event_name: str) -> Path:
    """A plugin that holds the event and answers every time that a judge run is queued."""
    folder = parent / "queuing-plugin"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "journal-plugin.json").write_text(json.dumps({"name": PLUGIN_NAME, "title": "Queuing", "version": "1.0.0", "protocol": 1, "program": "run.sh",
                                                             "hears": [event_name], "holds": [{"event": event_name, "window_ms": 5000}],
                                                             "processes": PROCESSES, "settings": "settings.json"}))
    (folder / "settings.json").write_text(json.dumps(SETTINGS))
    (folder / "run.sh").write_text(f"#!/bin/sh\ncat > /dev/null\ncat <<'ANSWER'\n{queue_answer(script)}\nANSWER\n")
    (folder / "run.sh").chmod(0o755)
    return folder
