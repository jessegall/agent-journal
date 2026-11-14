from tests.stories.engine.upgrade.support.fixture_upgrade import expect_upgrade_text


def test_a_task_log_line_moves_to_the_task_it_was_written_on(upgraded):
    story = upgraded
    story.expect_text("task-log list", "the totals are worked out")


def test_a_version_4_dependency_moves_and_the_one_that_closes_a_loop_is_dropped_and_counted(upgraded):
    story = upgraded
    expect_upgrade_text(story, "dropped dependency loops: 1 rows")
    listing = story.run("task-dependency list")
    listing.expect_text("2")
    listing.expect_text("1")
