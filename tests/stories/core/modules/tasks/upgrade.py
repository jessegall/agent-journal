from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story


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


def test_a_task_log_line_moves_to_the_task_it_was_written_on(new_story):
    story = upgraded_story(new_story)
    assert "the totals are worked out" in story.run("task-log list").output_text


def test_a_version_4_dependency_moves_and_the_one_that_closes_a_loop_is_dropped_and_counted(new_story):
    story = upgraded_story(new_story)
    assert "dropped dependency loops: 1 rows" in story.upgrade_text
    listing = story.run("task-dependency list").output_text
    assert "2" in listing and "1" in listing


def test_the_agent_that_held_a_task_in_version_4_holds_it_in_version_5(new_story):
    story = upgraded_story(new_story)
    agent = next(line.split()[0] for line in story.run("agent list").output_text.splitlines() if "s-1" in line)
    story.expect_success("task show 2", f"holder_id: {agent}")


def test_a_started_task_with_no_holder_in_version_4_moves_as_blocked_with_the_reason_its_holder_was_not_found(new_story):
    story = upgraded_story(new_story)
    story.expect_success("task show 5", "title: Ship the till", "state: blocked", "reason: its holder was not found")
