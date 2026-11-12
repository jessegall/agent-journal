import json
import os
from pathlib import Path

from engine.provider.program_hooks import ProgramHooks
from tests.stories.core.support.fixtures import MainEnvironment

PERSON_HOOK = {"matcher": "", "hooks": [{"type": "command", "command": "touch /tmp/foreign-ran"}]}
LOCAL_STOP_HOOK = {"matcher": "", "hooks": [{"type": "prompt", "prompt": "Check before stopping"}]}


def claude_person_file() -> Path:
    return Path(os.environ["CLAUDE_CONFIG_DIR"]) / "settings.json"


def journal_file(story) -> Path:
    return story.home.project_folder / ".journal" / "programs" / "claude" / "settings.json"


def test_a_terminal_launch_reads_only_the_journal_settings_and_the_project_source(new_story):
    story = new_story(fixture=MainEnvironment)
    root = story.home.project_folder
    ProgramHooks.store(claude_person_file(), {"hooks": {"PreToolUse": [PERSON_HOOK]}, "enabledPlugins": {"sample@market": True}})
    ProgramHooks.store(root / ".claude" / "settings.local.json", {"hooks": {"Stop": [LOCAL_STOP_HOOK]}})
    settings_file = story.home.folder / "programs" / "claude" / "settings.json"
    outcome = story.run(f'program command claude "{root}" --launch launch-1')
    arguments = outcome.output_text.splitlines()
    settings = json.loads(settings_file.read_text())
    journal_file(story).parent.mkdir(parents=True, exist_ok=True)
    journal_file(story).write_text(settings_file.read_text())
    story.expect_success(f'program trust claude "{root}"', "ready")
    journal_file(story).unlink()
    story.expect_success(f'program trust claude "{root}"', "unwritten")
    story.expect_rows(outcome.code == 0, arguments[1:5] == ["--settings", str(journal_file(story)), "--setting-sources", "project"],
                      Path(arguments[2]).is_absolute(), "user" not in arguments and "local" not in arguments,
                      "--session-id" in arguments and "--model" in arguments and "--effort" in arguments,
                      "touch /tmp/foreign-ran" not in json.dumps(settings), "enabledPlugins" not in settings, "Check before stopping" not in json.dumps(settings),
                      all(len(blocks) == 1 for blocks in settings["hooks"].values()), "PreToolUse" in settings["hooks"] and "Stop" in settings["hooks"],
                      "CLAUDE_CONFIG_DIR" not in outcome.output_text)


def test_the_person_s_own_settings_flags_are_refused(new_story):
    story = new_story(fixture=MainEnvironment)
    root = story.home.project_folder
    refusal = "the journal launches Claude Code on its own settings; --settings and --setting-sources cannot be given"
    story.expect_refusal(f'program command claude "{root}" --launch launch-1 --program-argument=--settings --program-argument=my.json', refusal)
    story.expect_refusal(f'program command claude "{root}" --launch launch-1 --program-argument=--setting-sources=user', refusal)
