from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined


class ReadyApprovalPlan(StoryFixture):
    """A user and an agent in main, with plan 1 ready for the user's approval."""

    parent = UserJoined

    def steps(self, story):
        story.run('plan make "Release" --environment main', actor=story.user)
        story.run("plan ready 1", actor=story.agent)


class CancelledApprovalPlan(StoryFixture):
    parent = ReadyApprovalPlan

    def steps(self, story):
        story.run('plan cancel 1 --reason "Replaced"', actor=story.user)
