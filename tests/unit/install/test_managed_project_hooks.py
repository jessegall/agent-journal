from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.program_hooks import ProgramHooks
from install.hook_switch import HookSwitch
from install.hook_writer import HookWriter

FILES = (".claude/settings.json", ".claude/settings.local.json", ".codex/hooks.json")


def project_hooks(root: Path):
    for index, name in enumerate(FILES):
        ProgramHooks.store(root / name, {"permissions": {"allow": ["Bash(ls)"]}, "hooks": {
            "PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": f"project-check-{index}", "timeout": 600}]}]}})
    return {name: (root / name).read_bytes() for name in FILES}


def assert_imported(root: Path):
    hooks = ManagedHooks(JournalHome(root / ".journal")).all()
    assert {hook.command for hook in hooks} == {"project-check-0", "project-check-1", "project-check-2"}
    assert {hook.source for hook in hooks} == set(FILES)
    for name in FILES:
        settings = ProgramHooks.read(root / name)
        assert settings["permissions"] == {"allow": ["Bash(ls)"]}
        assert ProgramHooks.partitioned(settings["hooks"])[1] == []
    for name in FILES[1:]:
        assert ProgramHooks.read(root / name)["hooks"]["PreToolUse"][0]["hooks"][0]["timeout"] == 690


def binary_runner(root: Path):
    binary = root / ".journal/bin/journal-hook"
    binary.parent.mkdir(parents=True, exist_ok=True)
    binary.write_text("#!/bin/sh\nexit 0\n")
    binary.chmod(0o755)
    return f'"{binary}"'


def test_binary_install_imports_project_hooks_from_every_provider_file(tmp_path):
    root = tmp_path / "project with spaces"
    project_hooks(root)
    HookWriter(root).write(binary_runner(root))
    assert_imported(root)


def test_fallback_install_keeps_project_hooks_in_their_files(tmp_path):
    original = project_hooks(tmp_path)
    HookWriter(tmp_path).write(f'sh "{tmp_path}/.journal/hooks/hook.sh"')
    assert not (tmp_path / ".journal/hooks/managed.json").exists()
    for index, name in enumerate(FILES):
        assert ProgramHooks.partitioned(ProgramHooks.read(tmp_path / name)["hooks"])[1] == [
            ("PreToolUse", "Bash", {"type": "command", "command": f"project-check-{index}", "timeout": 600})]
    assert (tmp_path / FILES[0]).read_bytes() == original[FILES[0]]


def test_binary_upgrade_backs_up_every_source_before_importing(tmp_path):
    original = project_hooks(tmp_path)
    binary_runner(tmp_path)
    HookSwitch(tmp_path).switch()
    assert_imported(tmp_path)
    for name in FILES:
        assert (tmp_path / ".journal/version-4/hooks" / name).read_bytes() == original[name]


def test_fallback_upgrade_keeps_every_project_command(tmp_path):
    project_hooks(tmp_path)
    HookSwitch(tmp_path).switch()
    assert not (tmp_path / ".journal/hooks/managed.json").exists()
    for index, name in enumerate(FILES):
        assert ProgramHooks.partitioned(ProgramHooks.read(tmp_path / name)["hooks"])[1] == [
            ("PreToolUse", "Bash", {"type": "command", "command": f"project-check-{index}", "timeout": 600})]


def test_upgrade_with_only_shared_claude_settings_installs_a_runner_before_importing(tmp_path):
    path = tmp_path / FILES[0]
    ProgramHooks.store(path, {"hooks": {"PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "shared-check"}]}]}})
    original = path.read_bytes()
    binary_runner(tmp_path)
    HookSwitch(tmp_path).switch()
    hooks = ManagedHooks(JournalHome(tmp_path / ".journal")).all()
    assert len(hooks) == 1 and hooks[0].command == "shared-check"
    assert (tmp_path / FILES[1]).is_file()
    assert (tmp_path / ".journal/version-4/hooks" / FILES[0]).read_bytes() == original
    assert not (tmp_path / FILES[2]).exists()
