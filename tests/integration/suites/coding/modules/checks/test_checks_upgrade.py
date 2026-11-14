import json

import pytest

from install.version_four.upgrade_journal import UpgradeJournal
from tests.integration.support.integration_journal import IntegrationJournal
from tests.stories.fixtures.version_four import version_four_fixture


@pytest.fixture
def upgraded(journal_with) -> tuple[IntegrationJournal, str]:
    journal = journal_with()
    version_four_fixture(journal.home.folder / "journal.db")
    outcome = UpgradeJournal(journal.home).run(confirmed=True)
    assert outcome.code == 0, outcome.text
    return journal, outcome.text


def test_version_4_checks_move_with_their_numbers_verdicts_and_intervals(upgraded):
    journal, _ = upgraded
    listed = journal.run("check list").text
    assert "passed  Suite (by hand)" in listed and "failed  Lint (every 15 min)" in listed
    assert "check 2 failed: Lint" in journal.run("check run 2").text


def test_a_retired_check_moves_removed_and_is_not_listed(upgraded):
    journal, _ = upgraded
    assert "Old check" not in journal.run("check list").text
    refused = journal.run("check remove 3")
    assert refused.code != 0 and "check 3 is removed already" in refused.text


def test_the_upgrade_counts_the_checks_moved_skipped_and_dropped_and_a_second_run_moves_none(upgraded):
    journal, text = upgraded
    assert "skipped checks 4:" in text and "dropped check wait targets: 1 rows" in text
    assert "journal.suites.coding.checks: moved 6, already moved 0" in text
    assert "nothing left to move" in UpgradeJournal(journal.home).run(confirmed=True).text


def test_a_check_that_blocks_a_task_moves_as_that_tasks_wait_and_a_retired_one_gives_none(upgraded):
    journal, _ = upgraded
    checks = json.loads(journal.run("check list --json").text)["rows"]
    waiting = next(row for row in checks if row["title"] == "task 3 waits until this passes")
    assert waiting["task_wait_id"] is not None and waiting["removed_at"] is None
    assert not any(row["title"] == "task 1 waits until this passes" for row in checks)
    assert "state: blocked" in journal.run("task show 3").text
    assert not any(row["title"] == "Task 3 waits until this passes" and row["task_wait_id"] for row in checks)
