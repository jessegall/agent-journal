from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderWithUser


class QueueAgents(StoryFixture):
    """A main agent and a worker share a queue without reader requirements."""

    parent = BuilderWithUser

    def steps(self, story):
        story.run("agent start queue-worker claude worker --environment main")
        story.run("setting set journal.core.processes.readers-forced off --environment main", actor=story.user)
