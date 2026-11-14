from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder
from core.modules.processes.models.enums.process_setting import ProcessSetting


class QueueAgents(StoryFixture):
    """A main agent and a worker share a queue without reader requirements; the worker may fill the long lane alone,
    as these stories are about the lane's room and not each starter's share of it."""

    parent = UserBuilder

    def steps(self, story):
        story.run("agent start queue-worker claude worker --environment main")
        story.run(f"setting set {ProcessSetting.READERS_FORCED.key} off --environment main", actor=story.user)
        story.run(f"setting set {ProcessSetting.STARTER_CAP_PERCENT.key} 100 --environment main", actor=story.user)
