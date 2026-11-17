import json
import sqlite3

from tests.integration.support.upgraded_journal import UpgradedJournal
from tests.stories.engine.upgrade.support.fixture_upgrade import repeated_upgrade, expect_upgrade_text


def test_a_second_upgrade_moves_no_sequence_again(upgraded):
    story = upgraded
    expect_repeated_upgrade_with(story, "nothing left to move")


def test_a_sequence_whose_triggers_or_guards_do_not_read_is_skipped_and_told(upgraded):
    story = upgraded
    expect_upgrade_text(story, "nonsense is no type of trigger")
    expect_upgrade_text(story, "does not read")
    story.expect_success("sequence list")
    story.expect_absent("sequence list", "Broken")


def expect_repeated_upgrade_with(story, expected) -> None:
    actual = repeated_upgrade(story).text
    assert expected in actual, actual


def a_long_version_four_step(folder):
    connection = sqlite3.connect(folder / "journal.db")
    row = connection.execute("SELECT id, steps FROM sequences ORDER BY id LIMIT 1").fetchone()
    steps = json.loads(row[1])
    steps[0]["instructions"] = "Read every line of the report and act on it. " * 20
    connection.execute("UPDATE sequences SET steps = ? WHERE id = ?", [json.dumps(steps), row[0]])
    connection.commit()
    connection.close()


def test_a_version_four_step_longer_than_version_five_allows_is_cut_and_the_sequence_reads(journal_with):
    story = UpgradedJournal.upgraded(journal_with(), a_long_version_four_step)
    story.expect_success("sequence list")
    story.expect_text("sequence show 1", "…")
