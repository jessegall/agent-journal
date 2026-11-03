from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.support.fixtures import UserJoined


class PermanentMemoryType(StoryFixture):
    """The builder has a non-fading project memory type enabled for the coding suite."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        UserJoined().steps(story)
        story.expect_success('memory-type make project journal.core.memories "Permanent project knowledge"')
        story.expect_success('memory-type-switch make project coding journal.core.memories --enabled')
