from concurrent.futures import ThreadPoolExecutor
from dataclasses import replace
from pathlib import Path
from unittest.mock import patch

import pytest

from engine.journal.journal_home import JournalHome
from engine.provider.managed_hook import ManagedHook
from engine.provider.managed_hooks import ManagedHooks
from engine.enums.managed_state import ManagedState


def sample_hook(command: str = "check") -> ManagedHook:
    return ManagedHook.found("sample", "BeforeTool", "Shell", {"command": command, "timeout": 30, "statusMessage": "Checking"}, "settings.json", True, 600)


def test_a_hook_without_timeout_gets_600_seconds():
    assert ManagedHook.found("sample", "BeforeTool", "Shell", {"command": "check"}, "settings.json", True, 600).timeout == 600


def test_an_entry_with_args_and_no_command_is_loaded():
    hook = ManagedHook.found("claude", "PreToolUse", "Bash", {"type": "command", "args": ["node", "check.js"]}, "settings.json", True, 600)
    assert hook.command == "node check.js" and hook.fields == {"args": ["node", "check.js"]}


def test_the_extra_fields_args_and_shell_are_kept():
    hook = ManagedHook.found("claude", "PreToolUse", "Bash", {"type": "command", "command": "node", "args": ["check.js"], "shell": "bash"}, "settings.json", True, 600)
    assert (hook.command, hook.fields) == ("node", {"args": ["check.js"], "shell": "bash"})


def test_facts_name_each_set_field():
    entry = {"command": "node", "args": ["check.js"], "if": "Bash(git *)", "asyncRewake": True, "onFailure": "block", "shell": "bash", "timeout": 20}
    assert ManagedHook.found("claude", "PreToolUse", "Bash", entry, "settings.json", True, 600).facts() == [
        "If: Bash(git *)", "In the background, wakes the agent", "Timeout: 20 s", "Blocks on failure", "Shell: bash", "Arguments"]


def test_facts_always_show_the_timeout():
    hook = ManagedHook.found("claude", "PostToolUse", "Edit", {"command": "lint", "async": True}, "settings.json", True, 600)
    assert hook.facts() == ["In the background", "Timeout: 600 s"]


def test_facts_are_empty_for_a_plain_hook_except_the_timeout():
    assert ManagedHook.found("claude", "Stop", "", {"command": "check"}, "settings.json", True, 600).facts() == ["Timeout: 600 s"]


def test_the_same_hook_has_the_same_id_and_keeps_extra_fields():
    hook = sample_hook()
    assert hook.id == sample_hook().id
    assert hook.id != sample_hook("additional_hook").id
    assert hook.fields == {"statusMessage": "Checking"}


def test_added_keeps_a_known_hooks_state_and_timeout_and_enables_new_hooks(tmp_path: Path):
    home = JournalHome(tmp_path)
    store = ManagedHooks(home)
    hook = sample_hook()
    assert store.all() == []
    store.added([hook])
    store.changed(hook.id, ManagedState.DISABLED, 17)
    additional_hook = replace(sample_hook("additional_hook"), state=ManagedState.DISABLED)
    store.added([hook, additional_hook])
    assert ManagedHooks(home).all() == [replace(hook, state=ManagedState.DISABLED, timeout=17), replace(additional_hook, state=ManagedState.ENABLED)]
    assert store.emptied() == [replace(hook, state=ManagedState.DISABLED, timeout=17), replace(additional_hook, state=ManagedState.ENABLED)]
    assert store.all() == []


def test_a_failed_write_leaves_the_old_file_whole(tmp_path: Path):
    home = JournalHome(tmp_path)
    store = ManagedHooks(home)
    store.added([sample_hook()])
    previous_bytes = store.path.read_bytes()
    with patch("engine.provider.managed_hooks.os.replace", side_effect=OSError("write failed")):
        with pytest.raises(OSError, match="write failed"):
            store.added([sample_hook("additional_hook")])
    assert store.path.read_bytes() == previous_bytes
    assert store.all() == [sample_hook()]


def test_two_writers_lose_no_entries(tmp_path: Path):
    home = JournalHome(tmp_path)
    hooks = [sample_hook(str(number)) for number in range(16)]
    with ThreadPoolExecutor(max_workers=2) as writers:
        list(writers.map(lambda hook: ManagedHooks(home).added([hook]), hooks))
    assert {hook.id for hook in ManagedHooks(home).all()} == {hook.id for hook in hooks}
