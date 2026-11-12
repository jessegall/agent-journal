import json

from engine.query.queries import Queries
from suites.coding.modules.checks.models.check import Check
from tests.stories.engine.upgrade.support.fixture_upgrade import repeated_upgrade, upgraded_story, expect_upgrade_text
from tests.stories.support.story_checks import expect_repeated_upgrade

TEST_ROWS_REASON = "the test reads every row it checks"


def test_version_4_checks_move_with_their_numbers_verdicts_and_intervals(new_story):
    story = upgraded_story(new_story)
    story.expect_text("check list", "passed  Suite (by hand)", "failed  Lint (every 15 min)")
    story.expect_text("check run 2", "check 2 failed: Lint")


def test_a_retired_check_moves_removed_and_is_not_listed(new_story):
    story = upgraded_story(new_story)
    story.expect_absent("check list", "Old check")
    story.expect_refusal("check remove 3", "check 3 is removed already")


def test_a_check_with_no_title_is_skipped_and_the_wait_target_flag_is_counted_as_dropped(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "skipped checks 4:")
    expect_upgrade_text(story, "dropped check wait targets: 1 rows")


def test_the_checks_moved_are_counted_and_a_second_run_moves_none(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "journal.suites.coding.checks: moved 6, already moved 0")
    expect_repeated_upgrade(story, "nothing left to move")


def test_a_check_that_blocks_a_task_moves_as_that_tasks_wait(new_story):
    story = upgraded_story(new_story)
    checks = json.loads(story.run("check list --json", actor=story.user).output_text)["rows"]
    waiting = next(row for row in checks if row["title"] == "task 3 waits until this passes")
    expect_changed_task_wait_id(waiting, None)
    expect_removed_waiting(waiting, None)
    expect_absent_title_checks("task 1 waits until this passes", checks)
    story.expect_text("task show 3", "state: blocked", actor=story.user)


def test_a_retired_check_gives_a_blocked_task_no_wait_of_its_own(new_story):
    story = upgraded_story(new_story)
    retired = list(story.container.get(Queries).query(Check).with_removed().filter(title="Task 3 waits until this passes").every_row(TEST_ROWS_REASON))
    story.expect_rows(len(retired) == 1, retired[0].removed_at is not None, retired[0].task_wait_id is None)


def expect_absent_title_checks(text, checks) -> None:
    actual = any((row['title'] == text for row in checks))
    assert not actual, actual


def expect_changed_task_wait_id(waiting, expected) -> None:
    actual = waiting['task_wait_id']
    assert actual is not expected, actual


def expect_removed_waiting(waiting, expected) -> None:
    actual = waiting['removed_at']
    assert actual is expected, actual
