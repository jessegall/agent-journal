from dataclasses import dataclass

from journal.engine.permission import Permission
from journal.engine.states.paused import Paused


@dataclass(frozen=True)
class Awaiting(Paused):
    """Waiting for named workers. Stopping is fine; when the last one is back, the agent is told and returns to what it was doing."""

    name = "awaiting"
    allows = frozenset({Permission.WRITE_FILES, Permission.RUN_COMMANDS, Permission.DISPATCH_SUBAGENTS})
    workers: tuple[int, ...] = ()

    def awaiting(self) -> tuple[str, str]:
        return f"workers {", ".join(str(n) for n in self.workers)}", ",".join(f"helper:{n}" for n in self.workers)
