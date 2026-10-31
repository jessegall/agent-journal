from install.upgrade_journal import UpgradeJournal
from tests.stories.core.base.upgrade.upgrade import content, count
from tests.stories.fixtures.version_four import version_four_fixture, with_message_rows, with_unknown_table, drop_later_columns

MESSAGE_COUNT = 20000


def test_a_journal_of_an_older_version_4_release_without_later_columns_upgrades_as_far_as_its_columns_go(new_story):
    story = new_story()
    drop_later_columns(version_four_fixture(story.home.folder / "journal.db"))
    outcome = UpgradeJournal(story.home).run(confirmed=True)
    assert outcome.code == 0, outcome.text
    story.expect_success("task show 3", "state: blocked")


def test_an_empty_version_4_journal_upgrades_and_moves_nothing(new_story):
    story = new_story()
    version_four_fixture(story.home.folder / "journal.db", with_rows=False)
    outcome = UpgradeJournal(story.home).run(confirmed=True)
    assert outcome.code == 0 and count(story, "version_four_map") == 0, outcome.text


def test_a_very_large_version_4_journal_upgrades(new_story):
    story = new_story()
    with_message_rows(version_four_fixture(story.home.folder / "journal.db"), MESSAGE_COUNT)
    outcome = UpgradeJournal(story.home).run(confirmed=True)
    assert outcome.code == 0 and count(story, "version_four_map") > MESSAGE_COUNT, outcome.text


def test_a_table_version_5_does_not_know_stays_in_the_backup_and_is_listed_as_not_claimed(new_story):
    story = new_story()
    with_unknown_table(version_four_fixture(story.home.folder / "journal.db"))
    outcome = UpgradeJournal(story.home).run(confirmed=True)
    assert outcome.code == 0 and "not claimed: gadgets (1 rows)" in outcome.text, outcome.text


def test_a_read_only_journal_folder_is_refused_plainly_and_changes_nothing(new_story):
    story = new_story()
    dump = content(version_four_fixture(story.home.folder / "journal.db"))
    story.home.folder.chmod(0o555)
    try:
        outcome = UpgradeJournal(story.home).run(confirmed=True)
    finally:
        story.home.folder.chmod(0o755)
    assert outcome.code == 1 and "cannot be written to" in outcome.text and "nothing was changed" in outcome.text, outcome.text
    assert content(story.home.folder / "journal.db") == dump and not (story.home.folder / "version-4").exists()
