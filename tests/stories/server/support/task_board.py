from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined


class TwelveFinishedTasks(StoryFixture):
    """Twelve tasks cancelled at the same clock timestamp."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        for number in range(1, 13):
            story.expect_success(f'task make "Closed task {number}" --environment main', actor=story.user)
            story.expect_success(f'task cancel {number} --reason "finished"', actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_success("task show 12", "state: cancelled")
