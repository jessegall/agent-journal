import errno
import shutil
from pathlib import Path

import pytest

from core.base.change.event_log import EventLog
from core.base.database.database import Database
from install.restore_version_four import RestoreVersionFour
from install.upgrade_journal import UpgradeJournal
from install.version_four_files import VersionFourFiles
from tests.stories.core.base.upgrade.support.move_samples import ORDER, PATH, TagsMove
from tests.stories.core.base.upgrade.upgrade import expect_upgrade, upgrade, upgrading

NOTES, TAGS, RETRYABLE_TAGS = f"{PATH}:NotesModule", f"{PATH}:TagsModule", f"{PATH}:RetryableTagsModule"


class RecordFailure(Exception):
    """The upgrade's record could not be written."""


def backups(story) -> list[Path]:
    return list((story.home.folder / "version-4").glob("*/journal.db"))


def expect_version_four_working(story, original: bytes) -> None:
    assert (story.home.folder / "journal.db").read_bytes() == original


def expect_restore_matches_backup(story, original: bytes) -> None:
    story.container.get(Database).close()
    outcome = RestoreVersionFour(story.home).run()
    assert outcome.code == 0, outcome.text
    assert (story.home.folder / "journal.db").read_bytes() == original == backups(story)[0].read_bytes()


def test_a_full_disk_while_the_backup_is_made_changes_nothing_and_leaves_no_half_backup(new_story, monkeypatch):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    original = version_four.read_bytes()

    def full_disk(source: object, target: object) -> None:
        raise OSError(errno.ENOSPC, "No space left on device")

    monkeypatch.setattr(shutil, "copy2", full_disk)
    outcome = upgrade(story)
    assert outcome.code == 1 and "No space left on device" in outcome.text and "nothing was changed" in outcome.text, outcome.text
    expect_version_four_working(story, original)
    assert backups(story) == []


def test_a_failure_while_the_finish_is_written_leaves_version_4_in_place_and_the_restore_matches_the_backup(new_story, monkeypatch):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    original = version_four.read_bytes()

    def failing_write(self: EventLog, *arguments: object) -> None:
        raise RecordFailure("the record of the upgrade could not be written")

    monkeypatch.setattr(EventLog, "write_upgrade_finished", failing_write)
    with pytest.raises(RecordFailure):
        UpgradeJournal(story.home).run(confirmed=True)
    expect_version_four_working(story, original)
    monkeypatch.undo()
    expect_restore_matches_backup(story, original)


def test_a_failure_while_version_4s_files_are_retired_leaves_version_4_in_place_and_the_restore_matches_the_backup(new_story, monkeypatch):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    original = version_four.read_bytes()

    def failing_retire(self: VersionFourFiles) -> list[str]:
        raise OSError(errno.EIO, "Input/output error")

    monkeypatch.setattr(VersionFourFiles, "retire", failing_retire)
    with pytest.raises(OSError, match="Input/output error"):
        UpgradeJournal(story.home).run(confirmed=True)
    expect_version_four_working(story, original)
    monkeypatch.undo()
    expect_restore_matches_backup(story, original)


def test_an_interrupted_move_leaves_version_4_in_place_and_a_second_run_finishes(new_story, monkeypatch):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    original = version_four.read_bytes()

    def interrupted(self: TagsMove, *arguments: object) -> None:
        raise KeyboardInterrupt

    monkeypatch.setattr(TagsMove, "move", interrupted)
    with pytest.raises(KeyboardInterrupt):
        UpgradeJournal(story.home).run(confirmed=True)
    expect_version_four_working(story, original)
    monkeypatch.undo()
    expect_upgrade(story, "upgraded")


def test_a_second_run_after_a_partial_one_finishes_and_a_restore_after_it_matches_the_first_backup(new_story):
    story, version_four = upgrading(new_story, NOTES, RETRYABLE_TAGS)
    original = version_four.read_bytes()
    assert upgrade(story).code == 1
    expect_version_four_working(story, original)
    del ORDER[:]
    expect_upgrade(story, "upgraded")
    expect_restore_matches_backup(story, original)
