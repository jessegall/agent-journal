from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.testing.helper_expectation import HelperExpectation
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture

HELPER_LAUNCH_NAME = "helper-launch-1"


class HelperStarted(HelperExpectation, StoryFixture):
    """A main agent in environment main with a helper under it: story.agent and story.helper, whose process has
    not sent a hook yet. Its row holds the launch name until the hook of HookSamples.helper binds its session."""

    def steps(self, story: Story) -> None:
        story.run("environment make main /work/journal")
        story.agent = Actor(story.new_row_id("agent start main-1 claude main --environment main"), ActorType.AGENT)
        story.helper = Actor(story.new_row_id(f"agent start {HELPER_LAUNCH_NAME} claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)
