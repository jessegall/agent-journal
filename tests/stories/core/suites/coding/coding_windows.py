from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_file_feed_window_is_a_page_window_of_one_agent(new_story):
    window_story(new_story).expect_declared_window("coding.file-feed", "page", "agent")


def test_the_file_feed_window_reads_its_lines_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("coding.file-feed", "file-edit list")
    window.expect_window_allowed("coding.file-feed", "file-edit show 1")


def test_the_file_edits_window_is_a_page_window_of_the_environment(new_story):
    window_story(new_story).expect_declared_window("coding.file-edits", "page", "environment")


def test_the_file_edits_window_reads_its_lines_with_no_allowance(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("coding.file-edits", "file-edit list")
    window.expect_window_allowed("coding.file-edits", "file-edit show 1")
    window.expect_window_allowed("coding.file-edits", "agent list")


def test_the_terminal_window_is_a_page_window_of_one_agent_that_reads_nothing(new_story):
    window_story(new_story).expect_declared_window("coding.terminal", "page", "agent")
