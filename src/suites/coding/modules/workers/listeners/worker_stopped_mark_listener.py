from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import ENDED_FIELD, Agent
from suites.coding.modules.workers.listeners.worker_stop_mark_listener import WorkerStopMarkListener
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant


class WorkerStoppedMarkListener(WorkerStopMarkListener):
    """A worker that stops with tasks left shows as a mark in the main chat."""

    name = "workers.stopped-mark"
    event = "agent.update"

    def handle(self, event: LoggedEvent) -> None:
        if ENDED_FIELD not in event.data or event.data[ENDED_FIELD][0] is not None:
            return
        worker = self.queries.query(Agent).find(event.row_id)
        count = len(self.unfinished.rows(worker.id)) if worker.role == AgentRole.WORKER else 0
        if count and not self.unfinished.has_running_process(worker.id):
            self.show_stop(event, worker, WorkerMarkVariant.ENDED_EARLY, f"stopped with {count} tasks left")
