from concurrent.futures import ThreadPoolExecutor
from dataclasses import replace
from pathlib import Path
from unittest.mock import patch

import pytest

from engine.journal.journal_home import JournalHome
from engine.provider.managed_hook import ManagedHook
from engine.provider.managed_hooks import ManagedHooks
from engine.provider.managed_state import ManagedState


def sample_hook(command: str = "check") -> ManagedHook:
    return ManagedHook.found("sample", "BeforeTool", "Shell", {"command": command, "timeout": 30, "statusMessage": "Checking"}, "settings.json", True)


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
