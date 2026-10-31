import sqlite3

from install.upgrade_journal import UpgradeJournal
from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.fixtures.version_four import version_four_fixture


def test_version_4_worker_history_stays_in_the_backup_with_its_counts(new_story):
    story = upgraded_story(new_story)
    for table in ("sent_agents", "worker_todos", "proofs", "subagents"):
        assert f"dropped {table}: 1 rows" in story.upgrade_text


def test_the_report_says_finished_workers_are_history_and_a_running_one_is_sent_again(new_story):
    story = upgraded_story(new_story)
    assert "workers, their to-do items and proofs are history in the backup: send any worker that was still working again" in story.upgrade_text


def test_a_worker_whose_work_was_not_merged_is_named_in_the_report(new_story):
    story = new_story()
    database = version_four_fixture(story.home.folder / "journal.db")
    with sqlite3.connect(database) as connection:
        connection.execute("UPDATE sent_agents SET state = 'reported'")
    text = UpgradeJournal(story.home).run(confirmed=True).text
    assert "worker Ada had not finished (reported): fix the cart" in text
