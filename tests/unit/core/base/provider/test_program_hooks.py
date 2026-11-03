import json
from pathlib import Path

from core.base.provider.program_hooks import ProgramHooks
from tests.unit.core.base.samples.program_sample import HOOK_FILE, SampleProgram


def test_partition_splits_a_mixed_block_per_entry_and_keeps_noncommand_entries():
    journal_entry = {"type": "command", "command": "/p/.journal/bin/journal-hook sample /p"}
    project_entry = {"type": "command", "command": "check"}
    prompt_entry = {"type": "prompt", "prompt": "Review this"}
    block = {"matcher": "Shell", "description": "Checks", "hooks": [journal_entry, project_entry, prompt_entry]}
    kept, commands = ProgramHooks.partitioned({"BeforeTool": [block]})
    assert kept == {"BeforeTool": [{**block, "hooks": [journal_entry, prompt_entry]}]}
    assert commands == [("BeforeTool", "Shell", project_entry)]
    assert block["hooks"] == [journal_entry, project_entry, prompt_entry]


def test_partition_keeps_event_block_and_entry_order():
    first = {"type": "command", "command": "first"}
    second = {"type": "command", "command": "second"}
    third = {"type": "command", "command": "third"}
    fourth = {"type": "command", "command": "fourth"}
    kept, commands = ProgramHooks.partitioned({
        "Start": [{"matcher": "startup", "hooks": [first, second]}, {"hooks": [third]}],
        "BeforeTool": [{"matcher": "Shell", "hooks": [fourth]}],
    })
    assert kept == {}
    assert commands == [("Start", "startup", first), ("Start", "startup", second), ("Start", "", third), ("BeforeTool", "Shell", fourth)]


def test_partition_and_store_keep_settings_beside_hooks(tmp_path):
    path = tmp_path / "settings.json"
    settings = {"permissions": {"allow": ["Shell(ls)"]}, "hooks": {"Start": [{"hooks": [{"type": "command", "command": "check"}]}]}}
    ProgramHooks.store(path, settings)
    loaded = ProgramHooks.read(path)
    kept, commands = ProgramHooks.partitioned(loaded["hooks"])
    ProgramHooks.store(path, {**loaded, "hooks": kept})
    assert ProgramHooks.read(path) == {"permissions": settings["permissions"], "hooks": {}}
    assert len(commands) == 1


def test_partition_handles_empty_and_missing_settings_files(tmp_path):
    path = tmp_path / "nested" / "settings.json"
    assert ProgramHooks.read(path) == {}
    assert ProgramHooks.partitioned(None) == ({}, [])
    assert ProgramHooks.partitioned({}) == ({}, [])
    ProgramHooks.store(path, {})
    path.write_text("")
    assert ProgramHooks.read(path) == {}


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
