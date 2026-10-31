from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

OUTPUTS = "processes.outputs"
OUTPUT = "processes.output"


def window_story(new_story) -> WindowStory:
    return WindowStory(new_story(fixture=UserJoined))


def test_the_outputs_and_output_windows_are_component_windows_of_the_environment(new_story):
    window = window_story(new_story)
    window.expect_declared_window(OUTPUTS, "component", "environment")
    window.expect_declared_window(OUTPUT, "component", "environment")


def test_the_windows_read_outputs_processes_and_the_text_of_an_output_with_no_allowance(new_story):
    window = window_story(new_story)
    for name in (OUTPUTS, OUTPUT):
        for line in ("output list", "process list", "process show 1", "output peek 1 --summary", "output peek 1 --all"):
            window.expect_window_allowed(name, line)


def test_the_windows_run_stop_and_watch_with_no_allowance_and_nothing_else(new_story):
    window = window_story(new_story)
    for name in (OUTPUTS, OUTPUT):
        window.expect_window_allowed(name, "output stop 1")
        window.expect_window_allowed(name, "output watch 1")
        window.expect_window_refusal(name, "output prune 1", "does not declare")
