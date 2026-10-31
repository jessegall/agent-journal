from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_modules_sync_passes_the_window_check_with_both_windows_declared(new_story):
    window = window_story(new_story)
    window.expect_declared_window("questions.questions", "component", "environment")
    window.expect_declared_window("questions.waiting", "component", "environment")


def test_the_questions_window_reads_and_runs_only_its_declared_lines(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("questions.questions", "question list")
    window.expect_window_allowed("questions.questions", "question answer 1 --answer sqlite")
    window.expect_window_allowed("questions.questions", "question close 1")


def test_the_waiting_window_reads_the_waits_and_what_they_wait_on(new_story):
    window = window_story(new_story)
    window.expect_window_allowed("questions.waiting", "wait list")
    window.expect_window_allowed("questions.waiting", "wait-target list")
