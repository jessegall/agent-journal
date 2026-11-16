from core.modules.processes.support.priority_wait import PriorityWait
from dataclasses import dataclass
from core.modules.processes.support.pool_load import PoolLoad


@dataclass(frozen=True)
class ExecutionSnapshot:
    """Every lane and the waits of the last hour, read once, as lines and as JSON."""

    lanes: tuple[PoolLoad, ...]
    waits: tuple[PriorityWait, ...]

    def lane(self, lane: str) -> PoolLoad:
        return next(read for read in self.lanes if read.lane == lane)

    def lines(self) -> list[str]:
        waited = [wait for wait in self.waits if wait.count]
        return [*(line for read in self.lanes for line in read.lines()), "waits over the last hour:" if waited else "waits over the last hour: no run started",
                *(f"  {wait.described}" for wait in waited)]

    def json(self) -> dict[str, object]:
        return {"lanes": [read.json() for read in self.lanes],
                "waits": [{"priority": wait.priority.label, "runs": wait.count, "longest_seconds": round(wait.longest_seconds), "average_seconds": round(wait.average_seconds)}
                          for wait in self.waits]}
