from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined


class StartedSequence(StoryFixture):
    """An agent has started a two-step sequence without taking up its first step."""

    parent = UserJoined

    def steps(self, story) -> None:
        story.expect_success('sequence make "Release" --steps "Check the change | Publish it"', actor=story.user)
        story.expect_success("sequence run 1", actor=story.agent)
