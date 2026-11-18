from journal.features.workers.states.orchestrating import Orchestrating
from journal.features.workers.workers_options import ORCHESTRATOR_MODE, WorkersOptions
from tests.stories.fixtures.state_fixture import StateFixture
from tests.stories.fixtures.worker.two_workers import TwoWorkers


class OrchestratorTwoWorkers(StateFixture):
    """The user switched the agent with two clocked-in workers to orchestrator mode: story.agents.workers.first() on the parser and story.agents.workers.second() on story.tasks.peer."""

    stack = (Orchestrating,)

    parent = TwoWorkers

    settings = ((WorkersOptions.MODE, ORCHESTRATOR_MODE),)

    def steps(self, story) -> None:
        story.agent_reads(story.agents.main)

    def expected(self, story) -> None:
        story.expect_stack(story.agents.main, Orchestrating)
