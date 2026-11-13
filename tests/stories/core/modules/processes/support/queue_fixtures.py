from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder
from core.modules.processes.models.enums.process_setting import ProcessSetting


class QueueAgents(StoryFixture):
    """A main agent and a worker share a queue without reader requirements."""

    parent = UserBuilder

    def steps(self, story):
        story.run("agent start queue-worker claude worker --environment main")
        story.run(f"setting set {ProcessSetting.READERS_FORCED.key} off --environment main", actor=story.user)
