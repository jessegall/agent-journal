import json
from pathlib import Path

from engine.enums.hook_event_name import HookEventName
from engine.provider.program_hooks import ProgramHooks
from engine.provider.managed_hook import ManagedHook
from tests.unit.engine.samples.program_sample import HOOK_FILE, SampleProgram


def test_partition_splits_a_mixed_block_per_entry_and_keeps_noncommand_entries():
    journal_entry = {"type": "command", "command": "/p/.journal/bin/journal-hook sample /p"}
    project_entry = {"type": "command", "command": "check"}
    prompt_entry = {"type": "prompt", "prompt": "Review this"}
    block = {"matcher": "Shell", "description": "Checks", "hooks": [journal_entry, project_entry, prompt_entry]}
    parts = ProgramHooks.partitioned({"BeforeTool": [block]})
    assert parts.kept == {"BeforeTool": [{**block, "hooks": [journal_entry, prompt_entry]}]}
    assert parts.commands == [("BeforeTool", "Shell", project_entry)]
    assert block["hooks"] == [journal_entry, project_entry, prompt_entry]


def test_partition_keeps_event_block_and_entry_order():
    first = {"type": "command", "command": "first"}
    second = {"type": "command", "command": "second"}
    third = {"type": "command", "command": "third"}
    fourth = {"type": "command", "command": "fourth"}
    parts = ProgramHooks.partitioned({
        "Start": [{"matcher": "startup", "hooks": [first, second]}, {"hooks": [third]}],
        "BeforeTool": [{"matcher": "Shell", "hooks": [fourth]}],
    })
    assert parts.kept == {}
    assert parts.commands == [("Start", "startup", first), ("Start", "startup", second), ("Start", "", third), ("BeforeTool", "Shell", fourth)]


def test_partition_and_store_keep_settings_beside_hooks(tmp_path):
    path = tmp_path / "settings.json"
    settings = {"permissions": {"allow": ["Shell(ls)"]}, "hooks": {"Start": [{"hooks": [{"type": "command", "command": "check"}]}]}}
    ProgramHooks.store(path, settings)
    loaded = ProgramHooks.read(path)
    parts = ProgramHooks.partitioned(loaded["hooks"])
    ProgramHooks.store(path, {**loaded, "hooks": parts.kept})
    assert ProgramHooks.read(path) == {"permissions": settings["permissions"], "hooks": {}}
    assert len(parts.commands) == 1


def test_partition_handles_empty_and_missing_settings_files(tmp_path):
    path = tmp_path / "nested" / "settings.json"
    assert ProgramHooks.read(path) == {}
    assert ProgramHooks.partitioned(None).kept == {}
    assert ProgramHooks.partitioned(None).commands == []
    assert ProgramHooks.partitioned({}).native == {}
    assert ProgramHooks.partitioned({}).journal == {}
    ProgramHooks.store(path, {})
    path.write_text("")
    assert ProgramHooks.read(path) == {}


USER_BLOCK = {"matcher": "Bash", "hooks": [{"type": "command", "command": "my-linter"}]}


def test_events_without_managed_hooks_keep_the_default_timeout(tmp_path):
    path = tmp_path / "settings.json"
    ProgramHooks("sample", path, ["BeforeTool", "End"], 90).write("runner", tmp_path)
    settings = ProgramHooks.read(path)
    assert {event: blocks[0]["hooks"][0]["timeout"] for event, blocks in settings["hooks"].items()} == {"BeforeTool": 90, "End": 90}


def test_a_long_managed_hook_extends_only_its_program_and_event(tmp_path):
    path = tmp_path / "settings.json"
    managed = [
        ManagedHook.found("sample", "BeforeTool", "Shell", {"command": "slow", "timeout": 600}, "settings.json", False, 600),
        ManagedHook.found("sample", "BeforeTool", "Shell", {"command": "quick", "timeout": 10}, "settings.json", False, 600),
        ManagedHook.found("different", "End", "", {"command": "different", "timeout": 600}, "settings.json", False, 600),
    ]
    ProgramHooks("sample", path, ["BeforeTool", "End"], 90).write("runner", tmp_path, managed)
    settings = ProgramHooks.read(path)
    assert settings["hooks"] == {
        "BeforeTool": [{"matcher": "", "hooks": [{"type": "command", "command": f'runner sample "{tmp_path}"', "timeout": 690}]}],
        "End": [{"matcher": "", "hooks": [{"type": "command", "command": f'runner sample "{tmp_path}"', "timeout": 90}]}],
    }
OLD_JOURNAL_BLOCK = {"matcher": "", "hooks": [{"type": "command", "command": "exec sh /p/.journal/src/journal/hooks/hook.sh claude /p"}]}


def test_the_journals_old_hooks_are_replaced_and_everything_else_in_the_file_stays(tmp_path):
    settings = tmp_path / "settings.local.json"
    settings.write_text(json.dumps({"permissions": {"allow": ["Bash(ls)"]}, "hooks": {"PreToolUse": [USER_BLOCK, OLD_JOURNAL_BLOCK]}}))
    ProgramHooks("claude", settings, ["PreToolUse", "Stop"], 60).write('"/p/.journal/bin/journal-hook"', Path("/p"))
    contents = json.loads(settings.read_text())
    new_block = {"matcher": "", "hooks": [{"type": "command", "command": '"/p/.journal/bin/journal-hook" claude "/p"', "timeout": 60}]}
    assert contents == {"permissions": {"allow": ["Bash(ls)"]}, "hooks": {"PreToolUse": [USER_BLOCK, new_block], "Stop": [new_block]}}


def test_a_missing_settings_file_is_made_with_the_hooks_alone(tmp_path):
    settings = tmp_path / ".codex" / "hooks.json"
    ProgramHooks("codex", settings, ["Stop"], 60).write('"/p/.journal/bin/journal-hook"', Path("/p"))
    assert list(json.loads(settings.read_text())) == ["hooks"]


def test_a_programs_own_entry_fields_ride_on_each_hook_so_codex_reads_whole_lines(tmp_path):
    settings = tmp_path / ".codex" / "hooks.json"
    ProgramHooks("codex", settings, ["Stop"], 60, {"additionalContextLimit": 0}).write('"/p/.journal/bin/journal-hook"', Path("/p"))
    assert json.loads(settings.read_text())["hooks"]["Stop"][0]["hooks"][0]["additionalContextLimit"] == 0


def test_an_event_can_override_hook_fields_without_changing_other_events(tmp_path):
    settings = tmp_path / "hooks.json"
    ProgramHooks("sample", settings, ["Start", "End"], 90, {"customField": True},
                 event_fields={"End": {"timeout": 3}}).write("journal-hook", tmp_path)
    hooks = json.loads(settings.read_text())["hooks"]
    assert hooks["Start"][0]["hooks"][0]["timeout"] == 90
    assert hooks["End"][0]["hooks"][0]["timeout"] == 3
    assert all(blocks[0]["hooks"][0]["customField"] for blocks in hooks.values())


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


def test_replacing_a_journal_entry_keeps_native_entries_in_its_mixed_block(tmp_path):
    path = tmp_path / "hooks.json"
    prompt = {"type": "prompt", "prompt": "Review"}
    command = {"type": "command", "command": "check"}
    block = {"matcher": "Shell", "description": "Checks", "hooks": [OLD_JOURNAL_BLOCK["hooks"][0], command, prompt]}
    ProgramHooks.store(path, {"permissions": {"allow": []}, "hooks": {"BeforeTool": [block]}})
    parts = ProgramHooks.partitioned(ProgramHooks.read(path)["hooks"])
    assert parts.native == {"BeforeTool": [{**block, "hooks": [command, prompt]}]}
    assert parts.journal == {"BeforeTool": [OLD_JOURNAL_BLOCK | {"matcher": "Shell", "description": "Checks"}]}
    ProgramHooks("sample", path, ["BeforeTool"], 90).write("journal-hook", tmp_path)
    assert ProgramHooks.read(path)["hooks"]["BeforeTool"][0] == {**block, "hooks": [command, prompt]}
    assert ProgramHooks.read(path)["permissions"] == {"allow": []}


def test_journal_blocks_give_one_block_per_event_naming_the_root(tmp_path):
    blocks = ProgramHooks("sample", tmp_path / "hooks.json", ["Start", "End"], 90, {"customField": True}).journal_blocks("journal-hook", Path("/p"))
    entry = {"type": "command", "command": 'journal-hook sample "/p"', "timeout": 90, "customField": True}
    assert blocks == {"Start": [{"matcher": "", "hooks": [entry]}], "End": [{"matcher": "", "hooks": [entry]}]}
    assert not (tmp_path / "hooks.json").exists()


def test_journal_blocks_lengthen_the_timeout_for_a_managed_hook(tmp_path):
    hooks = ProgramHooks("claude", tmp_path / "settings.json", ["PreToolUse", "Stop"], 90)
    managed = [ManagedHook.found("claude", "PreToolUse", "Bash", {"command": "slow", "timeout": 60}, "settings.json", False, 600)]
    blocks = hooks.journal_blocks("journal-hook", Path("/p"), managed)
    assert blocks["PreToolUse"][0]["hooks"][0]["timeout"] == hooks.entry_timeout("PreToolUse", managed) == 150
    assert blocks["Stop"][0]["hooks"][0]["timeout"] == 90


def test_journal_names_the_given_path(tmp_path):
    hooks = ProgramHooks.journal(SampleProgram, tmp_path / "programs" / "sample" / "hooks.json")
    assert (hooks.path, list(hooks.events), hooks.provider) == (tmp_path / "programs" / "sample" / "hooks.json", ["Start", "BeforeTool", "End"], SampleProgram)


def test_the_entry_of_a_tool_event_with_a_default_timeout_hook_is_690_seconds(tmp_path):
    hooks = ProgramHooks.journal(SampleProgram, tmp_path / "hooks.json")
    managed = [ManagedHook.found("sample", "BeforeTool", "Shell", {"command": "check"}, "settings.json", False, SampleProgram.default_hook_seconds)]
    assert hooks.entry_timeout("BeforeTool", managed) == 690


def test_the_session_end_entry_is_never_longer_than_the_programs_limit(tmp_path, monkeypatch):
    monkeypatch.setattr(SampleProgram, "hook_events", {**SampleProgram.hook_events, "Finish": HookEventName.SESSION_END})
    managed = [ManagedHook.found("sample", "Finish", "", {"command": "cleanup"}, "settings.json", False, 600)]
    for limit in (60, 3):
        monkeypatch.setattr(SampleProgram, "session_end_limit_seconds", limit)
        hooks = ProgramHooks.journal(SampleProgram, tmp_path / "hooks.json")
        assert (hooks.entry_timeout("Finish", managed), hooks.entry_timeout("Finish", [])) == (limit, min(5, limit))
        assert hooks.entry_timeout("BeforeTool", []) == 90


def journal_hooks(tmp_path) -> ProgramHooks:
    return ProgramHooks.journal(SampleProgram, tmp_path / "hooks.json")


def test_every_event_has_one_journal_entry(tmp_path):
    blocks = ProgramHooks.journal(SampleProgram, tmp_path / "hooks.json").journal_blocks("journal-hook", Path("/p"))
    assert all(len(event_blocks) == 1 and len(event_blocks[0]["hooks"]) == 1 for event_blocks in blocks.values())


def test_the_journals_hooks_are_told_apart_from_the_native_ones(tmp_path):
    hooks = journal_hooks(tmp_path)
    hooks.write("journal-hook", Path("/p"))
    parts = ProgramHooks.partitioned(hooks.settings()["hooks"])
    assert parts.native == {} and len(parts.journal["End"][0]["hooks"]) == 1


def test_is_complete_needs_the_first_entry(tmp_path):
    hooks = journal_hooks(tmp_path)
    hooks.write("journal-hook", Path("/p"))
    assert hooks.is_complete()
    settings = hooks.settings()
    del settings["hooks"]["Start"]
    ProgramHooks.store(hooks.path, settings)
    assert not hooks.is_complete()


def test_names_root_holds_for_the_journal_entry(tmp_path):
    hooks = journal_hooks(tmp_path)
    hooks.write("journal-hook", Path("/p"))
    assert hooks.names_root(Path("/p")) and not hooks.names_root(Path("/q"))


def test_the_session_end_entry_is_five_seconds_for_claude(tmp_path, monkeypatch):
    monkeypatch.setattr(SampleProgram, "hook_events", {**SampleProgram.hook_events, "Finish": HookEventName.SESSION_END})
    monkeypatch.setattr(SampleProgram, "session_end_limit_seconds", 60)
    hooks = ProgramHooks.journal(SampleProgram, tmp_path / "hooks.json")
    quick = [ManagedHook.found("sample", "Finish", "", {"command": "cleanup", "timeout": 10}, "settings.json", False, 600)]
    assert (hooks.entry_timeout("Finish", []), hooks.entry_timeout("Finish", quick)) == (5, 15)


def test_the_prompt_entry_follows_the_measured_limit(tmp_path, monkeypatch):
    # report 1468: an explicit timeout on UserPromptSubmit is honoured, the 30 seconds are only its default
    monkeypatch.setattr(SampleProgram, "hook_events", {**SampleProgram.hook_events, "Ask": HookEventName.PROMPT})
    assert ProgramHooks.journal(SampleProgram, tmp_path / "hooks.json").entry_timeout("Ask", []) == 90
