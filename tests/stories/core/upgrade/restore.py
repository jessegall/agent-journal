from core.base.database.database import Database
from install.restore_version_four import RestoreVersionFour
from tests.stories.core.upgrade.upgrade import expect_upgrade, upgrading
from tests.stories.core.upgrade.support.move_samples import PATH

NOTES, TAGS = f"{PATH}:NotesModule", f"{PATH}:TagsModule"


def test_an_upgrade_then_a_restore_gives_back_version_4s_bytes_and_puts_version_5_aside_as_a_dated_file(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    original = version_four.read_bytes()
    expect_upgrade(story)
    story.container.get(Database).close()
    outcome = RestoreVersionFour(story.home).run()
    assert outcome.code == 0, outcome.text
    assert (story.home.folder / "journal.db").read_bytes() == original and not story.home.database.exists()
    assert len(list(story.home.folder.glob("version-5.*.db"))) == 1 and "restored from" in outcome.text


def test_a_restore_without_a_backup_is_refused(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    outcome = RestoreVersionFour(story.home).run()
    assert outcome.code == 1 and "nothing to restore" in outcome.text and story.home.database.exists()


def test_a_backup_that_fails_its_integrity_check_is_not_restored(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    expect_upgrade(story)
    backup = next((story.home.folder / "version-4").glob("*/journal.db"))
    backup.write_bytes(backup.read_bytes()[:100] + b"\0" * 5000)
    outcome = RestoreVersionFour(story.home).run()
    assert outcome.code == 1 and "fails its integrity check" in outcome.text and story.home.database.exists()
