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
    ])


def test_hook_writer_passes_the_saved_hooks_to_each_program(tmp_path: Path):
    store_managed_hook(tmp_path)
    HookWriter(tmp_path).write("runner")
    claude = ProgramHooks.read(tmp_path / ".claude/settings.local.json")["hooks"]
    codex = ProgramHooks.read(tmp_path / ".codex/hooks.json")["hooks"]
    assert claude["PreToolUse"][0]["hooks"][0]["timeout"] == 690
    assert claude["Stop"][0]["hooks"][0]["timeout"] == 90
    assert codex["PreToolUse"][0]["hooks"][0]["timeout"] == 90


def test_hook_switch_passes_the_saved_hooks_and_keeps_settings(tmp_path: Path):
    store_managed_hook(tmp_path)
    path = tmp_path / ".claude/settings.local.json"
    ProgramHooks.store(path, {"permissions": {"allow": ["Bash(ls)"]}})
    with patch.object(HookSwitch, "runner", return_value="runner"):
        HookSwitch(tmp_path).switch()
    settings = ProgramHooks.read(path)
    assert settings["permissions"] == {"allow": ["Bash(ls)"]}
    assert settings["hooks"]["PreToolUse"][0]["hooks"][0]["timeout"] == 690
    assert settings["hooks"]["Stop"][0]["hooks"][0]["timeout"] == 90


def test_hook_writer_records_the_runner_it_chose_for_the_journal_settings(tmp_path: Path):
    HookWriter(tmp_path).write(f'sh "{tmp_path}/.journal/hooks/hook.sh"')
    assert JournalHome(tmp_path / ".journal").hook_runner_choice.read_text() == f'sh "{tmp_path}/.journal/hooks/hook.sh"\n'
