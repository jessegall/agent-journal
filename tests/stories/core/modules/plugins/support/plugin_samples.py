import json
from pathlib import Path

PROGRAM = """#!/bin/sh
line=$(cat)
case "$line" in
  *'"command_starting"'*'rm -rf'*) echo '{"v": 1, "answer": "refuse", "reason": "no deletes here"}' ;;
  *'"file_edited"'*'a.py'*) echo '{"v": 1, "answer": "tell", "tell": "a.py was judged"}' ;;
  *'"command_starting"'*'cat broken'*) exit 3 ;;
  *'"command_starting"'*'git push'*) echo '{"v": 1, "require_skills": ["sample-rules"]}' ;;
  *'"command_starting"'*'git status'*) echo '{"v": 1, "cards": [{"kind": "state", "key": "branch", "label": "Branch is clean"}]}' ;;
  *'"command_starting"'*'git diff'*) echo '{"v": 1, "cards": [{"kind": "state", "key": "branch", "label": "Branch has changes", "tone": "warn"}]}' ;;
  *'"command_starting"'*'git log'*) printf '%s\\n' '{"v": 1, "commands": ["notice make \\"Release notes\\" --link https://example.org/notes --environment main"]}' ;;
esac
"""
SETTINGS = [{"key": "level", "title": "Level", "kind": "number", "default": 1, "help": "How strict it is"}]
MANIFEST = {"name": "sample", "title": "Sample", "version": "1.0.0", "protocol": 1, "program": "run.sh", "hears": ["command_starting", "file_edited"],
            "holds": [{"event": "command_starting", "window_ms": 5000}], "settings": "settings.json",
            "cards": [{"kind": "state", "label": "State", "tone": "note"}], "skills": "skills",
            "reaches": {"file_edited": ["workers"]}}
SKILL = "---\nname: sample-rules\ndescription: The rules the sample plugin checks\n---\n\n# Sample rules\n"


def sample_plugin_folder(parent: Path) -> Path:
    folder = parent / "sample-plugin"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "journal-plugin.json").write_text(json.dumps(MANIFEST))
    (folder / "settings.json").write_text(json.dumps(SETTINGS))
    (folder / "skills" / "sample-rules").mkdir(parents=True, exist_ok=True)
    (folder / "skills" / "sample-rules" / "SKILL.md").write_text(SKILL)
    program = folder / "run.sh"
    program.write_text(PROGRAM)
    program.chmod(0o755)
    return folder
