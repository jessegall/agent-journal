import json

from install.version_four.upgrade_journal import UpgradeJournal


def test_version_4_checks_move_with_their_numbers_verdicts_and_intervals(upgraded):
    upgraded.expect_text("check list", "passed  Suite (by hand)", "failed  Lint (every 15 min)")
    upgraded.expect_text("check run 2", "check 2 failed: Lint")


def test_a_retired_check_moves_removed_and_is_not_listed(upgraded):
    upgraded.expect_absent("check list", "Old check")
    upgraded.expect_refusal("check remove 3", "check 3 is removed already")


def test_the_upgrade_counts_the_checks_moved_skipped_and_dropped_and_a_second_run_moves_none(upgraded):
    for text in ("skipped checks 4:", "dropped check wait targets: 1 rows", "journal.suites.coding.checks: moved 6, already moved 0"):
        assert text in upgraded.upgrade_text, upgraded.upgrade_text
    assert "nothing left to move" in UpgradeJournal(upgraded.home).run(confirmed=True).text


def test_a_check_that_blocks_a_task_moves_as_that_tasks_wait_and_a_retired_one_gives_none(upgraded):
    checks = json.loads(upgraded.run("check list --json").output_text)["rows"]
    waiting = next(row for row in checks if row["title"] == "task 3 waits until this passes")
    assert waiting["task_wait_id"] is not None and waiting["removed_at"] is None
    assert not any(row["title"] == "task 1 waits until this passes" for row in checks)
    upgraded.expect_text("task show 3", "state: blocked")
    assert not any(row["title"] == "Task 3 waits until this passes" and row["task_wait_id"] for row in checks)
