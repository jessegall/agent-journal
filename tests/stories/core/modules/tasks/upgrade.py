from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story


def test_a_task_keeps_its_number_title_brief_and_state(new_story):
    story = upgraded_story(new_story)
    story.expect_success("task show 1", "title: Fix the cart", "brief: the total is wrong", "state: open", "priority: normal")
    story.expect_success("task show 2", "title: Ship the cart", "state: started", "priority: high")


def test_a_paused_task_moves_as_blocked_with_its_reason(new_story):
    story = upgraded_story(new_story)
    story.expect_success("task show 3", "state: blocked", "reason: the list is late")


def test_a_task_in_a_state_version_5_does_not_know_is_skipped_with_its_number_and_reason_and_the_rest_move(new_story):
    story = upgraded_story(new_story)
    assert "skipped tasks 4: state limbo" in story.upgrade_text
    story.expect_success("task show 3", "state: blocked")
