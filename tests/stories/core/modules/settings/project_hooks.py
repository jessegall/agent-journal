import json

from core.base.provider.managed_hooks import ManagedHooks
from core.base.provider.program_hooks import ProgramHooks
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


def test_the_project_hooks_query_reports_every_kind_without_importing_pending_entries(new_story, tmp_path, monkeypatch):
    story = new_story(SAMPLES, fixture=LeadStarted)
    root = story.home.project_folder
    user_folder = tmp_path / "user claude"
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(user_folder))
    monkeypatch.setenv("CODEX_HOME", str(tmp_path / "user codex"))
    user_file = user_folder / "settings.json"
    ProgramHooks.store(user_file, {"hooks": {"Stop": [{"hooks": [{"type": "command", "command": "user-check"}]}]}})
    user_bytes = user_file.read_bytes()
    source = root / ".claude/settings.json"
    ProgramHooks.store(source, {"hooks": {"PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "managed-check"}]}]}})
    story.expect_text("managed-hook scan", "managed hooks: 1")
    hook = story.container.get(ManagedHooks).all()[0]
    run = {"id": hook.id, "exit_code": 2, "stdout": "", "stderr": "unsafe", "milliseconds": 4, "timed_out": False, "answer": {"refusal": "unsafe", "lines": [], "terminal": ""}}
    story.hook("s-1", HookSamples.edit("cart.py").with_fields(firing="query-history", foreign=[run]))
    ProgramHooks.store(source, {"hooks": {"PreToolUse": [{"matcher": "Bash", "hooks": [
        {"type": "command", "command": "pending-check"}, {"type": "prompt", "prompt": "Review this"}]}]}})
    ProgramHooks.store(root / ".claude/settings.local.json", {"hooks": {"PreToolUse": [{"hooks": [
        {"type": "command", "command": "sh /project/.journal/hooks/hook.sh"}]}]}})
    reply = story.run("managed-hook list --json")
    assert reply.code == 0, reply.output_text
    data = json.loads(reply.output_text)
    assert len(data["managed"]) == 1
    assert data["managed"][0]["history"]["refused"] == 1
    assert data["managed"][0]["history"]["last"]["exit_code"] == 2
    assert data["managed"][0]["history"]["last_at"] is not None
    assert "can_refuse" in data["managed"][0]["hook"]["effects"]
    assert [entry["command"] for entry in data["pending"]] == ["pending-check"]
    assert {entry["reason"] for entry in data["unmanaged"]} == {"This entry is not a command.", "User-level files are listed without changes."}
    assert data["fallback"] is True
    assert user_file.read_bytes() == user_bytes
    assert len(story.container.get(ManagedHooks).all()) == 1


def test_the_project_hooks_window_is_a_settings_page_with_the_required_commands(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_declared_window("settings.project-hooks", "component", "page")
    window.expect_window_allowed("settings.project-hooks", "managed-hook list")
    window.expect_window_allowed("settings.project-hooks", "managed-hook set sample off 30")
    window.expect_window_allowed("settings.project-hooks", "managed-hook scan")
    window.expect_window_allowed("settings.project-hooks", "managed-hook give-back")
