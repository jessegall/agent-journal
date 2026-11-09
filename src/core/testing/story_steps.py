from core.testing.story import Story
from core.testing.story_budget import StoryBudget


class StorySteps:
    """The commands a story ran during its test body, excluding pytest fixture setup and teardown, and what
    that body cost in database points and processor time, counted from the test's start or from the story's
    own start when the test body opens it."""

    def __init__(self, story: Story, start: str, fixture: str = "") -> None:
        self.story = story
        self.start = start
        self.fixture = fixture
        self.first_step = 0
        self.last_step = 0
        self.first_path_step = 0
        self.last_path_step = 0
        self.first_points = story.repeated_work.points().total
        self.first_cpu = StoryBudget.clock()
        self.points = 0
        self.cpu_seconds = 0.0

    def begin_test(self) -> None:
        self.first_step = len(self.story.steps)
        self.first_path_step = len(self.story.path)
        self.first_points = self.story.repeated_work.points().total
        self.first_cpu = StoryBudget.clock()

    def finish_test(self) -> None:
        self.last_step = len(self.story.steps)
        self.last_path_step = len(self.story.path)
        self.points = self.story.repeated_work.points().total - self.first_points
        self.cpu_seconds = StoryBudget.clock() - self.first_cpu

    def lines(self) -> list[str]:
        return self.story.steps[self.first_step:self.last_step]

    def path(self) -> list[str]:
        return self.story.path[self.first_path_step:self.last_path_step]
