from core.testing.story import Story
from core.testing.story_fixture import StoryFixture


class Demonstrated(StoryFixture):
    """An empty journal that `journal demo seed` filled, with the listeners that follow its commands run."""

    def steps(self, story: Story) -> None:
        story.expect_text("demo seed", "seeded")
        story.run_listeners()

    def expect(self, story: Story) -> None:
        story.expect_text("demo seed --list", "journal.core.tasks")
