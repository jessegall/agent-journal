import os
import time

from core.base.command.bus import Bus
from core.modules.claude_code.providers import claude_code_provider
from core.modules.drivers.commands.prune_temp_folders.prune_temp_folders import PruneTempFolders
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted


def session_folders(story, monkeypatch, tmp_path, *sessions: str):
    monkeypatch.setattr(claude_code_provider, "TEMPORARY_FILES_FOLDER", tmp_path)
    project = str(story.home.folder.resolve().parent).replace("/", "-").replace(".", "-")
    root = tmp_path / f"claude-{os.getuid()}" / project
    folders = {session: root / session for session in sessions}
    for folder in folders.values():
        (folder / "tasks").mkdir(parents=True)
    return folders


def prune(story) -> None:
    story.container.get(Bus).run(PruneTempFolders(), story.agent, environment_id=1)


def test_a_running_sessions_folder_stays(new_story, monkeypatch, tmp_path):
    story = new_story(fixture=BuilderStarted)
    folders = session_folders(story, monkeypatch, tmp_path, "s-1")
    prune(story)
    expect_exists_1_folders(folders)


def test_an_ended_sessions_folder_goes(new_story, monkeypatch, tmp_path):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.sample("session_end"))
    folders = session_folders(story, monkeypatch, tmp_path, "s-1")
    prune(story)
    expect_absent_exists_1_folders(folders)


def test_an_unknown_sessions_folder_stays_a_week(new_story, monkeypatch, tmp_path):
    story = new_story(fixture=BuilderStarted)
    folders = session_folders(story, monkeypatch, tmp_path, "recent", "old")
    month_old = time.time() - 30 * 24 * 3600
    os.utime(folders["old"], (month_old, month_old))
    prune(story)
    expect_exists_recent_folders(folders)
    expect_absent_exists_old_folders(folders)


def expect_exists_recent_folders(folders) -> None:
    actual = folders['recent'].exists()
    assert actual, actual


def expect_absent_exists_old_folders(folders) -> None:
    actual = folders['old'].exists()
    assert not actual, actual


def expect_absent_exists_1_folders(folders) -> None:
    actual = folders['s-1'].exists()
    assert not actual, actual


def expect_exists_1_folders(folders) -> None:
    actual = folders['s-1'].exists()
    assert actual, actual
