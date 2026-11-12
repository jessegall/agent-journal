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


def test_hook_writer_passes_the_saved_hooks_and_leaves_claude_s_project_file_alone(tmp_path: Path):
    store_managed_hook(tmp_path)
    HookWriter(tmp_path).write("runner")
    codex = ProgramHooks.read(tmp_path / ".codex/hooks.json")["hooks"]
    assert not (tmp_path / ".claude/settings.local.json").exists()
    assert codex["PreToolUse"][0]["hooks"][0]["timeout"] == 690
    assert codex["Stop"][0]["hooks"][0]["timeout"] == 90


def test_hook_switch_keeps_claude_s_settings_and_names_the_journal_s_own_files(tmp_path: Path):
    store_managed_hook(tmp_path)
    path = tmp_path / ".claude/settings.local.json"
    ProgramHooks.store(path, {"permissions": {"allow": ["Bash(ls)"]}})
    with patch.object(HookSwitch, "runner", return_value="runner"):
        lines = HookSwitch(tmp_path).switch()
    assert ProgramHooks.read(path) == {"permissions": {"allow": ["Bash(ls)"]}}
    assert lines == [f"Claude Code and Codex start on the journal's own settings in .journal/programs, whose hooks call runner; the old files are in {HookSwitch(tmp_path).saved}"]


def test_hook_switch_names_the_codex_file_it_still_writes(tmp_path: Path):
    store_managed_hook(tmp_path)
    ProgramHooks.store(tmp_path / ".codex/hooks.json", {"hooks": {}})
    with patch.object(HookSwitch, "runner", return_value="runner"):
        lines = HookSwitch(tmp_path).switch()
    assert lines == [f"the hooks of .codex/hooks.json call runner; the old files are in {HookSwitch(tmp_path).saved}"]
    assert ProgramHooks.read(tmp_path / ".codex/hooks.json")["hooks"]["PreToolUse"][0]["hooks"][0]["timeout"] == 690


def test_hook_writer_records_the_runner_it_chose_for_the_journal_settings(tmp_path: Path):
    HookWriter(tmp_path).write(f'sh "{tmp_path}/.journal/hooks/hook.sh"')
    assert JournalHome(tmp_path / ".journal").hook_runner_choice.read_text() == f'sh "{tmp_path}/.journal/hooks/hook.sh"\n'
