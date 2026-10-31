from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_plans_window_is_a_page_window_of_the_environment(new_story):
    window_story(new_story).expect_declared_window("plans.plans", "component", "environment")


def test_the_plans_window_reads_its_lines_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("plans.plans", "plan list")
    window.expect_window_allowed("plans.plans", "plan show 1")
    window.expect_window_allowed("plans.plans", "plan progress 1")
    window.expect_window_allowed("plans.plans", "phase list")
