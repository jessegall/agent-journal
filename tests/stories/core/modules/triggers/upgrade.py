from tests.stories.core.base.upgrade.support.fixture_upgrade import repeated_upgrade, upgraded_story, expect_upgrade_text
from tests.stories.support.story_checks import expect_repeated_upgrade


def test_version_4_triggers_move_with_their_numbers_phrases_and_actions(new_story):
    story = upgraded_story(new_story)
    story.expect_text("trigger list", "deploy, release -> nudge: Run the release sequence", "rm -rf -> deny: never remove folders")


def test_a_scheduled_trigger_keeps_its_next_time_and_interval_and_one_with_no_next_time_moves_struck(new_story):
    story = upgraded_story(new_story)
    story.expect_text("trigger list", "Check the build", "2036-01-01")
    story.expect_absent("trigger list", "Said once", actor=None)


def test_a_trigger_with_no_text_is_skipped_with_its_number_and_reason(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "skipped triggers 5: its text is 0 characters")


def test_the_triggers_moved_are_counted_and_a_second_run_moves_none(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "journal.core.triggers: moved 4, already moved 0")
    expect_repeated_upgrade(story, "nothing left to move")
