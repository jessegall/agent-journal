import json
from pathlib import Path

from core.base.provider.program_hooks import ProgramHooks
from tests.unit.core.base.samples.program_sample import HOOK_FILE, SampleProgram

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


def test_a_programs_own_entry_fields_ride_on_each_hook_so_codex_reads_whole_lines(tmp_path):
    settings = tmp_path / ".codex" / "hooks.json"
    ProgramHooks("codex", settings, ["Stop"], 60, {"additionalContextLimit": 0}).write('"/p/.journal/bin/journal-hook"', Path("/p"))
    assert json.loads(settings.read_text())["hooks"]["Stop"][0]["hooks"][0]["additionalContextLimit"] == 0


def test_a_providers_hooks_are_written_where_its_hook_file_says_for_every_hook_it_sends(tmp_path):
    hooks = ProgramHooks.hooks(SampleProgram, tmp_path)
    assert (hooks.path, list(hooks.events)) == (tmp_path / HOOK_FILE, ["Start", "BeforeTool", "End"])


def test_a_hook_file_is_written_only_once_it_holds_the_journals_entry_for_every_hook(tmp_path):
    hooks = ProgramHooks.hooks(SampleProgram, tmp_path)
    empty_file = hooks.is_complete()
    ProgramHooks("sample", tmp_path / HOOK_FILE, ["Start"], 60).write('"/p/.journal/bin/journal-hook"', tmp_path)
    start_hook_file = hooks.is_complete()
    hooks.write('"/p/.journal/bin/journal-hook"', tmp_path)
    assert (empty_file, start_hook_file, hooks.is_complete()) == (False, False, True)
