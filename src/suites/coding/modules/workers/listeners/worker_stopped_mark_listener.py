from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import ENDED_FIELD, Agent
from suites.coding.modules.workers.listeners.worker_stop_mark_listener import WorkerStopMarkListener
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from core.base.change.updated import Updated
from core.modules.agents.models.agent import Agent


class WorkerStoppedMarkListener(WorkerStopMarkListener[Updated[Agent]]):
    """A worker that stops with tasks left shows as a mark in the main chat."""

    name = "workers.stopped-mark"

    def handle(self, event: Updated[Agent], logged: LoggedEvent) -> None:
        if ENDED_FIELD not in logged.data or logged.data[ENDED_FIELD][0] is not None:
            return
        worker = event.row
        count = len(self.unfinished.rows(worker.id)) if worker.role == AgentRole.WORKER else 0
        if count and not self.unfinished.has_running_process(worker.id):
            self.show_stop(logged, worker, WorkerMarkVariant.ENDED_EARLY, f"stopped with {count} tasks left")
