from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_tasks_window_is_a_page_window_of_the_environment(new_story):
    window_story(new_story).expect_declared_window("tasks.tasks", "page", "environment")


def test_the_tasks_window_reads_its_lines_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("tasks.tasks", "task list")
    window.expect_window_allowed("tasks.tasks", "task show")
    window.expect_window_allowed("tasks.tasks", "task-log list")
