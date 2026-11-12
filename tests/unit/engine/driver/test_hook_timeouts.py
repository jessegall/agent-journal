from pathlib import Path
from unittest.mock import patch

from engine.journal.journal_home import JournalHome
from engine.provider.managed_hook import ManagedHook
from engine.provider.managed_hooks import ManagedHooks
from engine.provider.program_hooks import ProgramHooks
from install.hook.hook_switch import HookSwitch
from install.hook.hook_writer import HookWriter


def store_managed_hook(root: Path) -> None:
    ManagedHooks(JournalHome(root / ".journal")).added([
        ManagedHook.found("claude", "PreToolUse", "Bash", {"command": "slow", "timeout": 600}, ".claude/settings.local.json", False),
        ManagedHook.found("codex", "PreToolUse", "Bash", {"command": "slow", "timeout": 600}, ".codex/hooks.json", False),
    ])


def test_hook_writer_writes_no_program_hook_file_into_the_project(tmp_path: Path):
    store_managed_hook(tmp_path)
    HookWriter(tmp_path).write("runner")
    assert not (tmp_path / ".claude/settings.local.json").exists()
    assert not (tmp_path / ".codex/hooks.json").exists()


def test_hook_switch_keeps_claude_s_settings_and_names_the_journal_s_own_files(tmp_path: Path):
    store_managed_hook(tmp_path)
    path = tmp_path / ".claude/settings.local.json"
    ProgramHooks.store(path, {"permissions": {"allow": ["Bash(ls)"]}})
    with patch.object(HookSwitch, "runner", return_value="runner"):
        lines = HookSwitch(tmp_path).switch()
    assert ProgramHooks.read(path) == {"permissions": {"allow": ["Bash(ls)"]}}
    assert lines == [f"Claude Code and Codex start on the journal's own settings in .journal/programs, whose hooks call runner; the old files are in {HookSwitch(tmp_path).saved}"]


def test_hook_switch_restore_brings_back_the_saved_journal_entries(tmp_path: Path):
    old_entry = {"matcher": "", "hooks": [{"type": "command", "command": 'sh "/p/.journal/hooks/hook.sh" codex /p'}]}
    ProgramHooks.store(tmp_path / ".codex/hooks.json", {"hooks": {"Stop": [old_entry]}})
    with patch.object(HookSwitch, "runner", return_value="runner"):
        HookSwitch(tmp_path).switch()
    assert HookSwitch(tmp_path).restore() == ["version 4's hooks are back in .codex/hooks.json"]
    assert ProgramHooks.read(tmp_path / ".codex/hooks.json")["hooks"]["Stop"] == [old_entry]


def test_hook_writer_records_the_runner_it_chose_for_the_journal_settings(tmp_path: Path):
    HookWriter(tmp_path).write(f'sh "{tmp_path}/.journal/hooks/hook.sh"')
    assert JournalHome(tmp_path / ".journal").hook_runner_choice.read_text() == f'sh "{tmp_path}/.journal/hooks/hook.sh"\n'
