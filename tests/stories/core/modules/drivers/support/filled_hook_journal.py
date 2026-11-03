from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderWithUser

ROW_COUNT = 40


class FilledHookJournal(StoryFixture):
    """A builder with tasks, messages and memories for cost checks."""

    parent = BuilderWithUser

    def steps(self, story: Story) -> None:
        for number in range(ROW_COUNT):
            story.expect_success(f'task make "Task {number}" --brief "A job to do" --environment main', actor=story.user)
            story.expect_success(f'message send "Message {number}" --environment main', actor=story.user)
            story.expect_success(f'memory make fact "Fact {number}" --project', actor=story.user)
