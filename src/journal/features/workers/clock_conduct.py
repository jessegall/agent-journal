from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.worker_delivered import WorkerDelivered
from journal.events.rows.worker_ready import WorkerReady
from journal.features.tasks.feature import Tasks
from journal.features.tasks.states.working import Working
from journal.models.worker_state import WorkerState


class ClockConduct(Conduct):
    """A worker's own conduct in every state: its writes wait until it clocks in, saying only that; clocking in puts it to work on the task it holds, and clocking out ends that work, so it may stop."""

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        rows = event.data.part(Workers).session_workers
        if event.call.writes and rows and rows[0].state == WorkerState.DISPATCHED:
            return self.refuse(Workers.READINESS.create())
        return self.none()

    def on_worker_ready(self, event: WorkerReady, settings: Settings) -> Transition:
        holdings = event.data.part(Tasks).agent_tasks
        return self.push(Working(task_id=holdings[0])) if holdings else self.none()

    def on_worker_delivered(self, event: WorkerDelivered, settings: Settings) -> Transition:
        return self.pop()
