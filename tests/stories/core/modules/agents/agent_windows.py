from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_agents_window_is_a_page_window_of_the_environment(new_story):
    window_story(new_story).expect_declared_window("agents.agents", "page", "environment")


def test_the_agents_window_reads_its_lines_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("agents.agents", "agent list")
    window.expect_window_allowed("agents.agents", "agent show 1")


def test_the_subagents_window_is_a_page_window_of_one_agent(new_story):
    window_story(new_story).expect_declared_window("agents.subagents", "page", "agent")


def test_the_subagents_window_reads_its_lines_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("agents.subagents", "agent list")
