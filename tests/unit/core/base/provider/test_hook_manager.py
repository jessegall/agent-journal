import subprocess
from pathlib import Path
from unittest.mock import patch

import pytest

from engine.journal.journal_home import JournalHome
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.refusal_style import RefusalStyle
from core.base.provider.hook_effect import HookEffect
from core.base.provider.hook_manager import HookManager
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.managed_state import ManagedState
from core.base.provider.program_hooks import ProgramHooks
from tests.unit.core.base.samples.program_sample import HOOK_FILE, SampleProgram

JOURNAL_ENTRY = {"type": "command", "command": "/p/.journal/bin/journal-hook sample /p"}
PROJECT_ENTRY = {"type": "command", "command": "check", "timeout": 30, "statusMessage": "Checking"}
SECOND_ENTRY = {"type": "command", "command": "format", "timeout": 20}
PROMPT_ENTRY = {"type": "prompt", "prompt": "Review this"}
SETTINGS = {
    "permissions": {"allow": ["Shell(ls)"]},
    "hooks": {
        "BeforeTool": [{"matcher": "Shell", "hooks": [JOURNAL_ENTRY, PROJECT_ENTRY, SECOND_ENTRY]}],
        "Start": [{"matcher": "startup", "hooks": [PROMPT_ENTRY]}],
    },
}


@pytest.fixture
def manager(tmp_path: Path, monkeypatch) -> HookManager:
    monkeypatch.setattr(SampleProgram, "hook_files", tuple([HOOK_FILE]))
    subprocess.run(["git", "init", str(tmp_path)], capture_output=True, check=True, timeout=10)
    ProgramHooks.store(tmp_path / HOOK_FILE, SETTINGS)
    subprocess.run(["git", "-C", str(tmp_path), "add", "--", str(HOOK_FILE)], capture_output=True, check=True, timeout=10)
    return HookManager(tmp_path, ManagedHooks(JournalHome(tmp_path / ".journal")))


def test_sweep_and_give_back_restore_the_original_settings(manager: HookManager):
    hooks = manager.import_hooks(SampleProgram, manager.root)
    assert len(hooks) == 2
    assert all(hook.tracked and hook.source == str(HOOK_FILE) for hook in hooks)
    settings = ProgramHooks.read(manager.root / HOOK_FILE)
    assert settings["permissions"] == SETTINGS["permissions"]
    assert settings["hooks"] == {
        "BeforeTool": [{"matcher": "Shell", "hooks": [JOURNAL_ENTRY]}],
        "Start": [{"matcher": "startup", "hooks": [PROMPT_ENTRY]}],
    }
    assert manager.restore() == hooks
    assert ProgramHooks.read(manager.root / HOOK_FILE) == SETTINGS
    assert manager.managed.all() == []


def test_a_hook_found_again_keeps_its_saved_state_and_timeout(manager: HookManager):
    hook = manager.import_hooks(SampleProgram, manager.root)[0]
    manager.managed.changed(hook.id, ManagedState.DISABLED, 17)
    ProgramHooks.store(manager.root / HOOK_FILE, SETTINGS)
    saved_hook = manager.import_hooks(SampleProgram, manager.root)[0]
    assert (saved_hook.id, saved_hook.state, saved_hook.timeout) == (hook.id, ManagedState.DISABLED, 17)


def test_a_disabled_hook_is_given_back_with_its_fields_and_changed_timeout(manager: HookManager):
    hook = manager.import_hooks(SampleProgram, manager.root)[0]
    manager.managed.changed(hook.id, ManagedState.DISABLED, 17)
    manager.restore()
    settings = ProgramHooks.read(manager.root / HOOK_FILE)
    assert settings["hooks"]["BeforeTool"][0]["hooks"][1] == {**PROJECT_ENTRY, "timeout": 17}


def test_unswept_lists_only_entries_added_after_a_sweep(manager: HookManager):
    manager.import_hooks(SampleProgram, manager.root)
    settings = ProgramHooks.read(manager.root / HOOK_FILE)
    settings["hooks"]["BeforeTool"][0]["hooks"].append({"type": "command", "command": "new check", "timeout": 10})
    ProgramHooks.store(manager.root / HOOK_FILE, settings)
    hooks = manager.unmanaged(SampleProgram, manager.root)
    assert [hook.command for hook in hooks] == ["new check"]
    assert len(manager.managed.all()) == 2


def test_a_file_without_project_commands_is_not_rewritten(manager: HookManager):
    manager.import_hooks(SampleProgram, manager.root)
    with patch.object(ProgramHooks, "store", wraps=ProgramHooks.store) as store:
        manager.import_hooks(SampleProgram, manager.root)
    store.assert_not_called()


def test_a_failed_managed_write_leaves_the_original_source_file(manager: HookManager):
    with patch.object(manager.managed, "added", side_effect=OSError("write failed")):
        with pytest.raises(OSError, match="write failed"):
            manager.import_hooks(SampleProgram, manager.root)
    assert ProgramHooks.read(manager.root / HOOK_FILE) == SETTINGS


def test_a_stripped_tracked_file_stays_out_of_commits_until_hooks_are_returned(manager: HookManager):
    git = ["git", "-C", str(manager.root), "-c", "user.name=Hook test", "-c", "user.email=hooks@example.test"]
    text_file = manager.root / "other.txt"
    text_file.write_text("before")
    subprocess.run([*git, "add", "other.txt"], check=True, capture_output=True, timeout=10)
    subprocess.run([*git, "commit", "-m", "Initial settings"], check=True, capture_output=True, timeout=10)
    original = (manager.root / HOOK_FILE).read_bytes()
    manager.import_hooks(SampleProgram, manager.root)
    status = subprocess.run([*git, "status", "--porcelain", "--untracked-files=no"], check=True, capture_output=True, timeout=10)
    assert status.stdout == b""
    flag = subprocess.run([*git, "ls-files", "-v", "--", str(HOOK_FILE)], check=True, capture_output=True, timeout=10)
    assert flag.stdout.startswith(b"S ")
    text_file.write_text("after")
    subprocess.run([*git, "commit", "-am", "Other change"], check=True, capture_output=True, timeout=10)
    committed = subprocess.run([*git, "show", f"HEAD:{HOOK_FILE}"], check=True, capture_output=True, timeout=10)
    assert committed.stdout == original
    manager.restore()
    assert (manager.root / HOOK_FILE).read_bytes() == original
    flag = subprocess.run([*git, "ls-files", "-v", "--", str(HOOK_FILE)], check=True, capture_output=True, timeout=10)
    assert flag.stdout.startswith(b"H ")


def test_sweeping_stores_the_programs_clash_labels(manager: HookManager, monkeypatch):
    monkeypatch.setattr(SampleProgram, "refusals", {HookEventName.PRE_TOOL_USE: RefusalStyle.DENY})
    monkeypatch.setattr(SampleProgram, "line_events", [HookEventName.PRE_TOOL_USE])
    hooks = manager.import_hooks(SampleProgram, manager.root)
    assert all(hook.effects == (HookEffect.CAN_REFUSE, HookEffect.ADDS_LINES) for hook in hooks)
    assert manager.managed.all() == hooks
    assert ProgramHooks.read(manager.managed.path)["hooks"][0]["clash"] == ["can_refuse", "adds_lines"]


def test_shell_fallback_keeps_native_hooks_even_when_import_is_requested(manager: HookManager):
    settings = {**SETTINGS, "hooks": {"BeforeTool": [{"matcher": "Shell", "hooks": [
        {"type": "command", "command": 'sh "/p/.journal/hooks/hook.sh" sample /p'}, PROJECT_ENTRY,
    ]}]}}
    path = manager.root / HOOK_FILE
    ProgramHooks.store(path, settings)
    original = path.read_bytes()
    assert manager.import_hooks(SampleProgram, manager.root) == []
    assert path.read_bytes() == original
    assert not manager.managed.path.exists()
    assert len(manager.unmanaged(SampleProgram, manager.root)) == 1
