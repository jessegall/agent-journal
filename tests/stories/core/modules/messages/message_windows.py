from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_chat_window_is_a_page_window_of_the_environment(new_story):
    window_story(new_story).expect_declared_window("messages.chat", "component", "environment")


def test_the_chat_window_reads_its_lines_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("messages.chat", "message list")
    window.expect_window_allowed("messages.chat", "message show 1")
