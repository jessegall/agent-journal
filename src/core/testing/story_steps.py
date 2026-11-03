from core.testing.story import Story


class StorySteps:
    """The commands a story ran during its test body, excluding pytest fixture setup and teardown."""

    def __init__(self, story: Story) -> None:
        self.story = story
        self.first_step = 0
        self.last_step = 0

    def begin_test(self) -> None:
        self.first_step = len(self.story.steps)

    def finish_test(self) -> None:
        self.last_step = len(self.story.steps)

    def lines(self) -> list[str]:
        return self.story.steps[self.first_step:self.last_step]
