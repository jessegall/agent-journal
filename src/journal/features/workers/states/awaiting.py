from dataclasses import dataclass

from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.rows.worker_back import WorkerBack
from journal.support.permission import Permission
from journal.engine.states.paused import Paused


@dataclass(frozen=True)
class Awaiting(Paused):
    """Waiting for named workers. Stopping is fine; when the last one is back, the agent is told and returns to what it was doing."""

    name = "awaiting"
    title = "Waiting on a worker"
    allows = frozenset({Permission.WRITE_FILES, Permission.RUN_COMMANDS, Permission.DISPATCH_SUBAGENTS})
    workers: tuple[int, ...] = ()

    def on_worker_back_workers(self, event: WorkerBack, settings: Settings) -> Transition:
        return self.unchanged()

    def awaiting(self) -> tuple[str, str]:
        return f"workers {", ".join(str(n) for n in self.workers)}", ",".join(f"workers:{n}" for n in self.workers)
