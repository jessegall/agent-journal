import json
from pathlib import Path

from install.program_hooks import ProgramHooks

OWN_BLOCK = {"matcher": "Bash", "hooks": [{"type": "command", "command": "my-linter"}]}
OLD_JOURNAL_BLOCK = {"matcher": "", "hooks": [{"type": "command", "command": "exec sh /p/.journal/src/journal/hooks/hook.sh claude /p"}]}


def test_the_journals_old_hooks_are_replaced_and_everything_else_in_the_file_stays(tmp_path):
    settings = tmp_path / "settings.local.json"
    settings.write_text(json.dumps({"permissions": {"allow": ["Bash(ls)"]}, "hooks": {"PreToolUse": [OWN_BLOCK, OLD_JOURNAL_BLOCK]}}))
    ProgramHooks("claude", settings, ["PreToolUse", "Stop"], 60).write('"/p/.journal/bin/journal-hook"', Path("/p"))
    contents = json.loads(settings.read_text())
    new_block = {"matcher": "", "hooks": [{"type": "command", "command": '"/p/.journal/bin/journal-hook" claude "/p"', "timeout": 60}]}
    assert contents == {"permissions": {"allow": ["Bash(ls)"]}, "hooks": {"PreToolUse": [OWN_BLOCK, new_block], "Stop": [new_block]}}


def test_a_missing_settings_file_is_made_with_the_hooks_alone(tmp_path):
    settings = tmp_path / ".codex" / "hooks.json"
    ProgramHooks("codex", settings, ["Stop"], 60).write('"/p/.journal/bin/journal-hook"', Path("/p"))
    assert list(json.loads(settings.read_text())) == ["hooks"]
