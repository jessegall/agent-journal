from core.base.database.database import Database
from install.restore_version_four import RestoreVersionFour
from tests.stories.core.base.upgrade.upgrade import expect_upgrade, upgrading
from tests.stories.core.base.upgrade.support.move_samples import PATH
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_code_outcome, expect_outcome_with

NOTES, TAGS = f"{PATH}:NotesModule", f"{PATH}:TagsModule"


def test_an_upgrade_then_a_restore_gives_back_version_4s_bytes_and_puts_version_5_aside_as_a_dated_file(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    original = version_four.read_bytes()
    expect_upgrade(story)
    story.container.get(Database).close()
    outcome = RestoreVersionFour(story.home).run()
    expect_row(outcome, code=0)
    expect_bytes_folder_home(story, "journal.db", original)
    expect_absent_exists_database_home(story)
    expect_home_files(story, "version-5.*.db", 1)
    expect_outcome_with(outcome, "restored from")


def test_a_restore_without_a_backup_is_refused(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    outcome = RestoreVersionFour(story.home).run()
    expect_code_outcome(outcome, 1)
    expect_outcome_with(outcome, "nothing to restore")
    expect_exists_database_home(story)


def test_a_backup_that_fails_its_integrity_check_is_not_restored(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    expect_upgrade(story)
    backup = next((story.home.folder / "version-4").glob("*/journal.db"))
    backup.write_bytes(backup.read_bytes()[:100] + b"\0" * 5000)
    outcome = RestoreVersionFour(story.home).run()
    expect_code_outcome(outcome, 1)
    expect_outcome_with(outcome, "fails its integrity check")
    expect_exists_database_home(story)


def expect_exists_database_home(story) -> None:
    actual = story.home.database.exists()
    assert actual, actual


def expect_home_files(story, text, expected) -> None:
    actual = len(list(story.home.folder.glob(text)))
    assert actual == expected, actual


def expect_bytes_folder_home(story, text, expected) -> None:
    actual = (story.home.folder / text).read_bytes()
    assert actual == expected, actual


def expect_absent_exists_database_home(story) -> None:
    actual = story.home.database.exists()
    assert not actual, actual
