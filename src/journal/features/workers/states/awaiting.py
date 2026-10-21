from dataclasses import dataclass, replace

from journal.engine.nudge import Nudge
from journal.engine.states.wait import Wait
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.worker_back import WorkerBack
from journal.events.rows.worker_dispatched import WorkerDispatched
from journal.events.rows.worker_stopped import WorkerStopped
from journal.support.permission import Permission


@dataclass(frozen=True)
class Awaiting(Wait):
    """Waiting for named workers, pushed by the workers conduct when this agent dispatches one and widened by each dispatch after. Stopping is fine and the agent may work on; each worker's return or stop is told, and when the last one is back the agent is told and goes back to what it was doing."""

    name = "awaiting"
    title = "Waiting on a worker"
    allows = frozenset({Permission.WRITE_FILES, Permission.RUN_COMMANDS, Permission.DISPATCH_SUBAGENTS})
    workers: tuple[int, ...] = ()

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.unchanged()

    def on_worker_dispatched_workers(self, event: WorkerDispatched, settings: Settings) -> Transition:
        if event.dispatched_by != event.session or event.worker_id in self.workers:
            return self.unchanged()
        return self.changed(replace(self, workers=(*self.workers, event.worker_id)))

    def on_worker_back_workers(self, event: WorkerBack, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        return self.one_returned(event.worker_id, Workers.WORKER_REPORTED.create(n=event.worker_id, name=event.name))

    def on_worker_stopped_workers(self, event: WorkerStopped, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        return self.one_returned(event.worker_id, Workers.WORKER_STOPPED_UNREPORTED.create(n=event.worker_id, name=event.name))

    def one_returned(self, worker_id: int, line: Nudge) -> Transition:
        from journal.features.workers.feature import Workers
        if worker_id not in self.workers:
            return self.unchanged()
        still_out = tuple(n for n in self.workers if n != worker_id)
        if still_out:
            return self.changed(replace(self, workers=still_out), line)
        return self.pop(line, Workers.WAITED_ON_CAME_BACK.create())

    def awaiting(self) -> tuple[str, str]:
        return f"workers {', '.join(str(n) for n in self.workers)}", ",".join(f"workers:{n}" for n in self.workers)
