from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined


class ReadableTexts(StoryFixture):
    """One document and one report for the main agent to read."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        story.expect_success('doc make "Cart design" --abstract "The cart" --body "Build the cart"', actor=story.user)
        story.expect_success('report make "Cart check" --abstract "The check" --body "The cart passed"', actor=story.user)
