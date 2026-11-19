from journal.engine.states.void import Void
from journal.features.tasks.states.external_wait import ExternalWait
from journal.features.tasks.states.ready import Ready
from journal.features.workers.states.working_task import WorkingTask
from tests.stories.fixtures.state_fixture import StateFixture
from tests.stories.fixtures.worker.working_worker import WorkingWorker


class WorkerHoldingATestTurn(StateFixture):
    """The working worker proved both points of its task and still holds a test turn of its own that runs, about to clock out."""

    stack = (Ready, ExternalWait)

    parent = WorkingWorker

    def steps(self, story) -> None:
        story.agent_proves(story.agents.workers.first(), 1, "parser.py:12, test_reads passes")
        story.agent_proves(story.agents.workers.first(), 2, "parser.py:30, test_names passes")
        story.worker_has_a_test_turn_running(story.agents.workers.first(), "earlier_story.py")

    def expected(self, story) -> None:
        story.expect_test_turn_running_for(story.agents.workers.first())
        story.expect_stack(story.agents.workers.first(), Void, WorkingTask)
