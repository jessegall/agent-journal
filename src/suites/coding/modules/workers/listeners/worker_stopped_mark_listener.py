from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.listeners.worker_stop_mark_listener import WorkerStopMarkListener
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant

ENDED_FIELD = "ended_at"


class WorkerStoppedMarkListener(WorkerStopMarkListener):
    """A worker that stops with tasks left shows as a mark in the main chat."""

    name = "workers.stopped-mark"
    event = "agent.update"

    def handle(self, event: LoggedEvent) -> None:
        if ENDED_FIELD not in event.data or event.data[ENDED_FIELD][0] is not None:
            return
        worker = self.queries.query(Agent).find(event.row_id)
        count = len(self.unfinished.rows(worker.id)) if worker.role is AgentRole.WORKER else 0
        if count:
            self.show_stop(event, worker, WorkerMarkVariant.ENDED_EARLY, f"stopped with {count} tasks left")
