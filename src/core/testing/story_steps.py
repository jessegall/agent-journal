from core.testing.story import Story


class StorySteps:
    """The commands a story ran during its test body, excluding pytest fixture setup and teardown."""

    def __init__(self, story: Story) -> None:
        self.story = story
        self.first_result = 0
        self.last_result = 0

    def begin_test(self) -> None:
        self.first_result = len(self.story.results)

    def finish_test(self) -> None:
        self.last_result = len(self.story.results)

    def lines(self) -> list[str]:
        return [outcome.line for outcome in self.story.results[self.first_result:self.last_result]]
