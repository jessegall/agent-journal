
from install.version_four.upgrade_journal import UpgradeJournal
from tests.stories.engine.upgrade.upgrade import content, count, expect_count
from tests.stories.fixtures.version_four import version_four_fixture, with_message_rows, with_unknown_table, strip_release_columns
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_code_outcome, expect_outcome_with

MESSAGE_COUNT = 20000


def test_an_empty_version_4_journal_upgrades_and_moves_nothing(new_story):
    story = new_story()
    version_four_fixture(story.home.folder / "journal.db", with_rows=False)
    outcome = UpgradeJournal(story.home).run(confirmed=True)
    expect_row(outcome, code=0)
    expect_count(story, "version_four_map", 0)


def test_a_very_large_version_4_journal_upgrades(new_story):
    story = new_story()
    with_message_rows(version_four_fixture(story.home.folder / "journal.db"), MESSAGE_COUNT)
    outcome = UpgradeJournal(story.home).run(confirmed=True)
    expect_code_outcome(outcome, 0)
    expect_table_count_greater(story, "version_four_map", MESSAGE_COUNT)


def test_a_table_version_5_does_not_know_stays_in_the_backup_and_is_listed_as_not_claimed(new_story):
    story = new_story()
    with_unknown_table(version_four_fixture(story.home.folder / "journal.db"))
    outcome = UpgradeJournal(story.home).run(confirmed=True)
    expect_code_outcome(outcome, 0)
    expect_outcome_with(outcome, "not claimed: gadgets (1 rows)")


def test_a_read_only_journal_folder_is_refused_plainly_and_changes_nothing(new_story):
    story = new_story()
    dump = content(version_four_fixture(story.home.folder / "journal.db"))
    story.home.folder.chmod(0o555)
    try:
        outcome = UpgradeJournal(story.home).run(confirmed=True)
    finally:
        story.home.folder.chmod(0o755)
    expect_code_outcome(outcome, 1)
    expect_outcome_with(outcome, "cannot be written to")
    expect_outcome_with(outcome, "nothing was changed")
    expect_content_2(story, "journal.db", dump)
    expect_absent_exists_folder_home(story, "version-4")


def expect_content_2(story, text, expected) -> None:
    actual = content(story.home.folder / text)
    assert actual == expected, actual


def expect_absent_exists_folder_home(story, text) -> None:
    actual = (story.home.folder / text).exists()
    assert not actual, actual


def expect_table_count_greater(story, text, expected) -> None:
    actual = count(story, text)
    assert actual > expected, actual
