from engine.event.logged_event import LoggedEvent
from engine.event.updated import Updated
from engine.listener.commit.commit_listener import CommitListener
from engine.listener.rows.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.models.enums.affected_test_state import AffectedTestState
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch

LAUNCHED_STATES = (AffectedTestState.PICKING, AffectedTestState.TESTING)


class AffectedTestMovedListener(CommitListener[Updated[AffectedTest]]):
    """An affected-test pick that is given its process, while it picks or tests, launches that process."""

    name = "workers.affected-test-moved"

    def __init__(self, launch: WorkerTestLaunch, rows: EventRows) -> None:
        self.launch, self.rows = launch, rows

    def handle(self, event: Updated[AffectedTest], logged: LoggedEvent) -> None:
        selection = event.row
        if selection.state not in LAUNCHED_STATES or selection.process_id is None:
            return
        process = self.rows.required(Process, selection.process_id)
        self.launch.start(process, process.line, self.rows.required(Agent, process.session_agent_id).session)
