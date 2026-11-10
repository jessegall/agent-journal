from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.base.driver.command_category import CommandCategory
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.process import Process
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderStarted


class ForcedReaders(StoryFixture):
    """A main agent and a worker with required readers enabled."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        story.run("setting set journal.core.processes.readers-forced on --environment main")
        story.run("setting set journal.suites.coding.workers.worker-run-most-tests 25 --environment main", actor=story.user)
        story.run("agent start s-reader claude worker --environment main")


def reader_worker(story: Story) -> Actor:
    worker = story.container.get(Queries).query(Agent).filter(session="s-reader").page(1, 1).rows[0]
    return Actor(worker.id, ActorType.AGENT)


def worker_run(story: Story, line: str = "custom-build run", category: CommandCategory = CommandCategory.TEST_RUN) -> Process:
    worker = reader_worker(story)
    return story.container.get(Bus).run(StartProcess.single_part(worker.id, line, "/work/main", category, 30), worker, environment_id=1)
