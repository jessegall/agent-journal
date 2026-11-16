from core.modules.processes.support.priority_wait import PriorityWait
from dataclasses import dataclass
from core.modules.processes.support.pool_load import PoolLoad


@dataclass(frozen=True)
class ExecutionSnapshot:
    """Every lane and the waits of the last hour, read once, as lines and as JSON."""

    pools: tuple[PoolLoad, ...]
    waits: tuple[PriorityWait, ...]

    def pool(self, pool: str) -> PoolLoad:
        return next(read for read in self.pools if read.pool == pool)

    def lines(self) -> list[str]:
        waited = [wait for wait in self.waits if wait.count]
        return [*(line for read in self.pools for line in read.lines()), "waits over the last hour:" if waited else "waits over the last hour: no run started",
                *(f"  {wait.described}" for wait in waited)]

    def json(self) -> dict[str, object]:
        return {"lanes": [read.json() for read in self.pools],
                "waits": [{"priority": wait.priority.label, "runs": wait.count, "longest_seconds": round(wait.longest_seconds), "average_seconds": round(wait.average_seconds)}
                          for wait in self.waits]}
