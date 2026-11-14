from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderStarted


class TwoOpenTasks(StoryFixture):
    """A builder with the total and tax tasks open."""

    parent = BuilderStarted

    def steps(self, story) -> None:
        story.run('task make "Fix the total" --environment main', actor=story.agent)
        story.run('task make "Fix the tax" --environment main', actor=story.agent)
