from suites.coding.support.coding_helper_role import CodingHelperRole
from engine.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import Agent
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.models.wait import Wait
from suites.coding.modules.workers.listeners.worker_stop_mark_listener import WorkerStopMarkListener
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from engine.change.created import Created


class WorkerHelpRequestMarkListener(WorkerStopMarkListener[Created[Wait]]):
    """A worker that says it is stuck shows as a mark in the main chat with its reason."""

    name = "workers.help-request-mark"

    def handle(self, event: Created[Wait], logged: LoggedEvent) -> None:
        wait = event.row
        worker = self.event_rows.required(Agent, wait.session_agent_id)
        if wait.type is WaitType.HELP_REQUEST and worker.role == CodingHelperRole.WORKER:
            self.show_stop(logged, worker, WorkerMarkVariant.HELP_REQUEST, f"is stuck: {wait.focus}", self.unfinished.rows(worker.id))
