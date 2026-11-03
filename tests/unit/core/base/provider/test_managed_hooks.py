from concurrent.futures import ThreadPoolExecutor
from dataclasses import replace
from pathlib import Path
from unittest.mock import patch

import pytest

from core.base.journal_home import JournalHome
from core.base.provider.managed_hook import ManagedHook
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.managed_state import ManagedState


def found(command: str = "check") -> ManagedHook:
    return ManagedHook.found("sample", "BeforeTool", "Shell", {"command": command, "timeout": 30, "statusMessage": "Checking"}, "settings.json", True)


def test_the_same_hook_has_the_same_id_and_keeps_extra_fields():
    hook = found()
    assert hook.id == found().id
    assert hook.id != found("other").id
    assert hook.fields == {"statusMessage": "Checking"}


def test_added_keeps_a_known_hooks_state_and_timeout_and_enables_new_hooks(tmp_path: Path):
    home = JournalHome(tmp_path)
    store = ManagedHooks(home)
    hook = found()
    assert store.all() == []
    store.added([hook])
    store.changed(hook.id, ManagedState.OFF, 17)
    other = replace(found("other"), state=ManagedState.OFF)
    store.added([hook, other])
    assert ManagedHooks(home).all() == [replace(hook, state=ManagedState.OFF, timeout=17), replace(other, state=ManagedState.ON)]
    assert store.emptied() == [replace(hook, state=ManagedState.OFF, timeout=17), replace(other, state=ManagedState.ON)]
    assert store.all() == []


def test_a_failed_write_leaves_the_old_file_whole(tmp_path: Path):
    home = JournalHome(tmp_path)
    store = ManagedHooks(home)
    store.added([found()])
    before = store.path.read_bytes()
    with patch("core.base.provider.managed_hooks.os.replace", side_effect=OSError("write failed")):
        with pytest.raises(OSError, match="write failed"):
            store.added([found("other")])
    assert store.path.read_bytes() == before
    assert store.all() == [found()]


def test_two_writers_lose_no_entries(tmp_path: Path):
    home = JournalHome(tmp_path)
    hooks = [found(str(number)) for number in range(16)]
    with ThreadPoolExecutor(max_workers=2) as writers:
        list(writers.map(lambda hook: ManagedHooks(home).added([hook]), hooks))
    assert {hook.id for hook in ManagedHooks(home).all()} == {hook.id for hook in hooks}
