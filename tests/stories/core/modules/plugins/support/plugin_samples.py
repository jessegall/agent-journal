import json
from pathlib import Path

PROGRAM = """#!/bin/sh
line=$(cat)
case "$line" in
  *'"command_starting"'*'rm -rf'*) echo '{"v": 1, "answer": "refuse", "reason": "no deletes here"}' ;;
  *'"file_edited"'*'a.py'*) echo '{"v": 1, "answer": "tell", "tell": "a.py was judged"}' ;;
  *'"command_starting"'*'cat broken'*) exit 3 ;;
esac
"""
SETTINGS = [{"key": "level", "title": "Level", "kind": "number", "default": 1, "help": "How strict it is"}]
MANIFEST = {"name": "sample", "title": "Sample", "version": "1.0.0", "protocol": 1, "program": "run.sh", "hears": ["command_starting", "file_edited"],
            "holds": [{"event": "command_starting", "window_ms": 5000}], "settings": "settings.json"}


def sample_plugin_folder(parent: Path) -> Path:
    folder = parent / "sample-plugin"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "journal-plugin.json").write_text(json.dumps(MANIFEST))
    (folder / "settings.json").write_text(json.dumps(SETTINGS))
    program = folder / "run.sh"
    program.write_text(PROGRAM)
    program.chmod(0o755)
    return folder
