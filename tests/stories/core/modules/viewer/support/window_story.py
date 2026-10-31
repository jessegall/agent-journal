import shlex

from core.base.refusal import Refusal
from core.modules.viewer.window_lines import WindowLines
from core.testing.story import Story

ENVIRONMENT = "main"


class WindowStory:
    """A story's checks of the command lines a viewer window may run for the person at the viewer."""

    def __init__(self, story: Story) -> None:
        self.story = story

    def expect_window_allowed(self, window: str, line: str) -> None:
        self.story.container.get(WindowLines).check(window, shlex.split(line), self.story.user, ENVIRONMENT)

    def expect_window_refusal(self, window: str, line: str, reason: str) -> None:
        try:
            self.story.container.get(WindowLines).check(window, shlex.split(line), self.story.user, ENVIRONMENT)
        except Refusal as refusal:
            assert reason in refusal.reason, f"{window} {line!r} was refused, but not for {reason!r}: {refusal.reason}"
            return
        raise AssertionError(f"{window} {line!r} was not refused")
