import json
import os
import shutil
import tempfile
import tomllib
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from unittest.mock import patch

import pytest

from core.modules.agents.ticks.program_settings_tick import ProgramSettingsTick
from engine.errors.refusal import Refusal
from engine.file.file_access import FileAccess
from engine.provider.program_hooks import ProgramHooks
from engine.provider.program_settings_sync import ProgramSettingsSync
from tests.stories.core.support.fixtures import MainEnvironment


def claude_file(story) -> Path:
    return story.home.folder / "programs" / "claude" / "settings.json"


def program_files(story) -> list[Path]:
    programs = story.home.folder / "programs"
    return [programs / "claude" / "settings.json", programs / "codex" / "config.toml", programs / "codex" / "hooks.json"]


def manage(story, program: str) -> None:
    story.expect_text(f'program manage {program} "{story.home.project_folder}"', "managed hooks:")


def test_two_launches_at_once_write_the_same_file_safely(new_story):
    story = new_story(fixture=MainEnvironment)
    sync = story.container.get(ProgramSettingsSync)
    with ThreadPoolExecutor(max_workers=2) as launches:
        list(launches.map(lambda number: sync.prepare("claude"), range(2)))
    expected_text = sync.settings("claude").files[0].text
    story.expect_rows(claude_file(story).read_text() == expected_text, json.loads(claude_file(story).read_text())["permissions"]["defaultMode"] == "bypassPermissions")


def test_a_crash_between_the_temporary_file_and_the_rename_keeps_the_old_file(new_story):
    story = new_story(fixture=MainEnvironment)
    manage(story, "claude")
    older_text = claude_file(story).read_text()
    ProgramHooks.store(Path(os.environ["CLAUDE_CONFIG_DIR"]) / "settings.json", {"env": {"AFTER": "crash"}})
    sync = story.container.get(ProgramSettingsSync)
    with patch.object(FileAccess, "replace", side_effect=OSError("the server died")):
        with pytest.raises(Refusal, match="the server died"):
            sync.write("claude")
    unchanged_text = claude_file(story).read_text()
    manage(story, "claude")
    story.expect_rows(unchanged_text == older_text, claude_file(story).read_text() != older_text,
                      list(claude_file(story).parent.glob(f"{tempfile.gettempprefix()}*")) == [])


def test_a_machine_restart_writes_the_same_files_again(new_story):
    story = new_story(fixture=MainEnvironment)
    ProgramSettingsTick()(story.container)
    before = [path.read_bytes() for path in program_files(story)]
    shutil.rmtree(story.home.folder / "runtime")
    ProgramSettingsTick()(story.container)
    story.expect_rows([path.read_bytes() for path in program_files(story)] == before)


def test_a_longer_managed_hook_rewrites_the_claude_file_whole(new_story):
    story = new_story(fixture=MainEnvironment)
    ProgramSettingsTick()(story.container)
    ProgramHooks.store(story.home.project_folder / ".claude" / "settings.json",
                       {"hooks": {"PreToolUse": [{"matcher": "Bash", "hooks": [{"type": "command", "command": "project-check", "timeout": 300}]}]}})
    manage(story, "claude")
    hooks = json.loads(claude_file(story).read_text())["hooks"]
    story.expect_rows(all(len(blocks) == 1 and len(blocks[0]["hooks"]) == 1 for blocks in hooks.values()),
                      hooks["PreToolUse"][0]["hooks"][0]["timeout"] == 390, hooks["Stop"][0]["hooks"][0]["timeout"] == 90)


def test_a_new_worktree_is_trusted_by_codex_and_the_hook_hashes_stay(new_story):
    story = new_story(fixture=MainEnvironment)
    manage(story, "codex")
    config_file = story.home.folder / "programs" / "codex" / "config.toml"
    states_before = tomllib.loads(config_file.read_text())["hooks"]["state"]
    worktree = story.home.folder / "worktrees" / "development" / "worker-1"
    worktree.mkdir(parents=True)
    ProgramSettingsTick()(story.container)
    config = tomllib.loads(config_file.read_text())
    story.expect_rows(config["projects"][str(worktree.resolve())] == {"trust_level": "trusted"}, config["hooks"]["state"] == states_before)
