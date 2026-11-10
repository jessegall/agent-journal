from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.provider.managed_hooks import ManagedHooks
from engine.provider.program_hooks import ProgramHooks
from engine.provider.managed_state import ManagedState
from install.hook_switch import HookSwitch
from install.hook_writer import HookWriter
from install.version_four.restore_version_four import RestoreVersionFour

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
        assert ProgramHooks.partitioned(settings["hooks"]).commands == []
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
        assert ProgramHooks.partitioned(ProgramHooks.read(tmp_path / name)["hooks"]).commands == [
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
        assert ProgramHooks.partitioned(ProgramHooks.read(tmp_path / name)["hooks"]).commands == [
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


def test_version_four_restore_returns_disabled_hooks_and_keeps_new_hooks(tmp_path):
    project_hooks(tmp_path)
    old_runner = f'sh "{tmp_path}/.journal/hooks/hook.sh"'
    HookWriter(tmp_path).write(old_runner)
    binary_runner(tmp_path)
    HookSwitch(tmp_path).switch()
    home = JournalHome(tmp_path / ".journal")
    store = ManagedHooks(home)
    hook = store.all()[0]
    store.changed(hook.id, ManagedState.DISABLED, hook.timeout)
    path = tmp_path / FILES[1]
    settings = ProgramHooks.read(path)
    settings["hooks"]["PreToolUse"].append({"matcher": "Bash", "hooks": [{"type": "command", "command": "new-check"}]})
    ProgramHooks.store(path, settings)
    backup = tmp_path / "backup.db"
    backup.write_bytes(b"version four")
    RestoreVersionFour(home).restore(backup, [])
    assert store.all() == []
    for index, name in enumerate(FILES):
        entries = ProgramHooks.partitioned(ProgramHooks.read(tmp_path / name)["hooks"]).commands
        assert f"project-check-{index}" in [entry[2]["command"] for entry in entries]
    commands = [entry[2]["command"] for entry in ProgramHooks.partitioned(ProgramHooks.read(path)["hooks"]).commands]
    assert "new-check" in commands
    all_commands = [entry["command"] for blocks in ProgramHooks.read(path)["hooks"].values() for block in blocks for entry in block["hooks"]]
    assert any(old_runner in command for command in all_commands)
    assert not any(str(tmp_path / ".journal/bin/journal-hook") in command for command in all_commands)


def test_restore_splits_mixed_current_and_saved_blocks_without_losing_native_entries(tmp_path):
    path = tmp_path / FILES[1]
    saved_path = tmp_path / ".journal/version-4/hooks" / FILES[1]
    old = {"type": "command", "command": 'sh "/p/.journal/hooks/hook.sh" claude /p'}
    current = {"type": "command", "command": '"/p/.journal/bin/journal-hook" claude /p'}
    check = {"type": "command", "command": "check"}
    prompt = {"type": "prompt", "prompt": "Review"}
    ProgramHooks.store(saved_path, {"hooks": {"PreToolUse": [{"matcher": "Bash", "hooks": [old, check]}]}})
    ProgramHooks.store(path, {"permissions": {"allow": []}, "hooks": {"PreToolUse": [{"matcher": "Bash", "hooks": [current, check, prompt]}]}})
    unsaved = tmp_path / FILES[2]
    ProgramHooks.store(unsaved, {"hooks": {"PreToolUse": [{"hooks": [current, check, prompt]}]}})
    HookSwitch(tmp_path).restore()
    assert ProgramHooks.read(path) == {"permissions": {"allow": []}, "hooks": {"PreToolUse": [
        {"matcher": "Bash", "hooks": [check, prompt]}, {"matcher": "Bash", "hooks": [old]},
    ]}}
    assert ProgramHooks.read(unsaved)["hooks"] == {"PreToolUse": [{"hooks": [check, prompt]}]}
