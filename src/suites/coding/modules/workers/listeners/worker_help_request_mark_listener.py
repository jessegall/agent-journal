from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import Agent
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.models.wait import Wait
from suites.coding.modules.workers.listeners.worker_stop_mark_listener import WorkerStopMarkListener
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant


class WorkerHelpRequestMarkListener(WorkerStopMarkListener):
    """A worker that says it is stuck shows as a mark in the main chat with its reason."""

    name = "workers.help-request-mark"
    event = "wait.create"

    def handle(self, event: LoggedEvent) -> None:
        wait = self.queries.query(Wait).find(event.row_id)
        worker = self.queries.query(Agent).find(wait.agent_id)
        if wait.type is WaitType.HELP_REQUEST and worker.role == AgentRole.WORKER:
            self.show_stop(event, worker, WorkerMarkVariant.HELP_REQUEST, f"is stuck: {wait.focus}")
