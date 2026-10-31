from tests.stories.core.base.upgrade.support.fixture_upgrade import repeated_upgrade, upgraded_story


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
    assert "skipped checks 4:" in story.upgrade_text
    assert "dropped check wait targets: 1 rows" in story.upgrade_text


def test_the_checks_moved_are_counted_and_a_second_run_moves_none(new_story):
    story = upgraded_story(new_story)
    assert "journal.suites.coding.checks: moved 3, already moved 0" in story.upgrade_text
    assert repeated_upgrade(story).text == "nothing left to move"
