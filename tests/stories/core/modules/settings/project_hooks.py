import json

from engine.provider.managed_hooks import ManagedHooks
from engine.provider.program_hooks import ProgramHooks
from core.testing.hook_samples import HookSamples
from tests.stories.engine.driver.support.fixtures import LeadStarted
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_bytes_source


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
    reply.expect_code(0)
    data = json.loads(reply.output_text)
    expect_managed_data(data, 1)
    expect_journal_hooks_listed(data)
    expect_row(data["managed"][0]["history"], refused=1)
    expect_row(data["managed"][0]["history"]["last"], exit_code=2)
    expect_changed_last_history_managed(data, None)
    expect_effects_hook_managed_with(data, "can_refuse")
    expect_command_entry_pending(data, ["pending-check"])
    expect_reason_entry_unmanaged(data, {"This entry is not a command.", "User-level files are listed without changes."})
    expect_row(data, fallback=True)
    expect_bytes_source(user_file, user_bytes)
    expect_value_12(story, 1)


def test_the_project_hooks_window_is_a_settings_page_with_the_required_commands(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_declared_window("settings.project-hooks", "component", "page")
    window.expect_window_allowed("settings.project-hooks", "managed-hook list")
    window.expect_window_allowed("settings.project-hooks", "managed-hook set sample off 30")
    window.expect_window_allowed("settings.project-hooks", "managed-hook scan")
    window.expect_window_allowed("settings.project-hooks", "managed-hook give-back")


def expect_value_12(story, expected) -> None:
    actual = len(story.container.get(ManagedHooks).all())
    assert actual == expected, actual


def expect_reason_entry_unmanaged(data, expected) -> None:
    actual = {entry['reason'] for entry in data['unmanaged']}
    assert actual == expected, actual


def expect_command_entry_pending(data, expected) -> None:
    actual = [entry['command'] for entry in data['pending']]
    assert actual == expected, actual


def expect_effects_hook_managed_with(data, expected) -> None:
    actual = data['managed'][0]['hook']['effects']
    assert expected in actual, actual


def expect_changed_last_history_managed(data, expected) -> None:
    actual = data['managed'][0]['history']['last_at']
    assert actual is not expected, actual


def expect_managed_data(data, expected) -> None:
    actual = len(data['managed'])
    assert actual == expected, actual


def expect_journal_hooks_listed(data) -> None:
    actual = {(entry['program'], entry['source']) for entry in data['journal']}
    assert ('claude', '.claude/settings.local.json') in actual, actual
    assert all(entry['timeout'] > 0 for entry in data['journal']), data['journal']
