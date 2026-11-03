from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderWithUser

ROW_COUNT = 40


class FilledHookJournal(StoryFixture):
    """A builder after a prompt, with tasks, messages and memories for cost checks."""

    parent = BuilderWithUser

    def steps(self, story: Story) -> None:
        for number in range(ROW_COUNT):
            story.run(f'task make "Task {number}" --brief "A job to do" --environment main', actor=story.user)
            story.run(f'message send "Message {number}" --environment main', actor=story.user)
            story.run(f'memory make fact "Fact {number}" --project', actor=story.user)
        story.hook("s-1", HookSamples.prompt("Carry on"))

    def expect(self, story: Story) -> None:
        story.expect_text(f"task list --limit {ROW_COUNT}", f"Task {ROW_COUNT - 1}", actor=story.user)
