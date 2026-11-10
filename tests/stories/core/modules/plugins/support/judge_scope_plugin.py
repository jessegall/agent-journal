import json
import sys
from pathlib import Path

GUARD = '''import json
import os
import shlex
import sys

SCOPE_FLAGS = ("--changes", "--branch")

event = json.load(sys.stdin)
if event["role"] != "worker":
    sys.exit(0)
words = shlex.split(event["data"]["text"])
programs = [index for index, word in enumerate(words) if os.path.basename(word) == "commandments-release"]
if not programs or words[programs[0] + 1:programs[0] + 2] != ["judge"]:
    sys.exit(0)
if any(word == flag or word.startswith(f"{flag}=") for word in words[programs[0] + 2:] for flag in SCOPE_FLAGS):
    sys.exit(0)
reason = "a worker judges only its own work: run commandments-release judge with --changes or --branch"
print(json.dumps({"v": 1, "answer": "refuse", "reason": reason}))
'''


def judge_scope_plugin_folder(parent: Path) -> Path:
    folder = parent / "judge-scope-plugin"
    folder.mkdir()
    (folder / "journal-plugin.json").write_text(json.dumps({
        "name": "judge-scope", "title": "Judge scope", "version": "1.0.0", "protocol": 1,
        "listen": [{"event": "core.plugins.command_starting", "guard": "guard.sh", "window_ms": 5000}],
        "reaches": {"command_starting": ["workers"]},
    }))
    (folder / "scope.py").write_text(GUARD)
    guard = folder / "guard.sh"
    guard.write_text(f'#!/bin/sh\nexec "{sys.executable}" "$JOURNAL_PLUGIN_DIR/scope.py"\n')
    guard.chmod(0o755)
    return folder
