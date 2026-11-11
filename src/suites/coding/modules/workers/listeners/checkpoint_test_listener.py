from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.event.updated import Updated
from engine.listener.commit_listener import CommitListener
from engine.listener.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.models.checkpoint_test import RUNNING_STATES, CheckpointTest
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch


class CheckpointTestListener(CommitListener[Created[CheckpointTest] | Updated[CheckpointTest]]):
    """Launches the process of a test of a checkpoint run once the row that names it is committed."""

    name = "workers.checkpoint-tests"

    def __init__(self, launch: WorkerTestLaunch, rows: EventRows) -> None:
        self.launch, self.rows = launch, rows

    def handle(self, event: Created[CheckpointTest] | Updated[CheckpointTest], logged: LoggedEvent) -> None:
        test = event.row
        if test.state not in RUNNING_STATES:
            return
        process = self.rows.required(Process, test.process_id)
        self.launch.start(process, process.line, self.rows.required(Agent, test.owner_agent_id).session)
