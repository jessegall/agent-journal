from core.modules.processes.support.priority_waits import PriorityWait
from dataclasses import dataclass, field


@dataclass(frozen=True)
class LaneEntry:
    """One execution of a lane as a person reads it: its line, class, priority and starter, how long it has run or
    waited, why it waits, the priority it was raised from, and the line of the execution it is a waited child of."""

    line: str
    class_name: str
    priority: str
    starter: str
    seconds: float
    reason: str = ""
    raised_from: str = ""
    parent_line: str = ""

    def json(self) -> dict[str, object]:
        return {"line": self.line, "class": self.class_name, "priority": self.priority, "starter": self.starter, "seconds": round(self.seconds),
                "reason": self.reason, "raised_from": self.raised_from, "parent_line": self.parent_line}

    @property
    def described(self) -> str:
        return f"{self.line} ({self.class_name}, {self.priority}, {self.starter}, {self.seconds:.0f} s)"


@dataclass(frozen=True)
class LaneLoad:
    """One lane as a person reads it: the slot units its runs use against its capacity, whether it runs over or is
    halted, and what runs and what waits in it."""

    lane: str
    used: int
    capacity: int
    is_over: bool = False
    is_halted: bool = False
    running: tuple[LaneEntry, ...] = field(default_factory=tuple)
    waiting: tuple[LaneEntry, ...] = field(default_factory=tuple)

    def json(self) -> dict[str, object]:
        return {"lane": self.lane, "used": self.used, "capacity": self.capacity, "over_capacity": self.is_over, "halted": self.is_halted,
                "running": [entry.json() for entry in self.running], "waiting": [entry.json() for entry in self.waiting]}

    def lines(self) -> list[str]:
        over = " (over capacity)" if self.is_over else ""
        halted = " (halted)" if self.is_halted else ""
        return [f"{self.lane} lane: {self.used} of {self.capacity} slot units in use{over}{halted}, {len(self.waiting)} waiting",
                *(f"  runs: {entry.described}" for entry in self.running), *(f"  waits: {entry.described}, {entry.reason}" for entry in self.waiting)]


@dataclass(frozen=True)
class ExecutionSnapshot:
    """Every lane and the waits of the last hour, read once, as lines and as JSON."""

    lanes: tuple[LaneLoad, ...]
    waits: tuple[PriorityWait, ...]

    def lane(self, lane: str) -> LaneLoad:
        return next(load for load in self.lanes if load.lane == lane)

    def lines(self) -> list[str]:
        waited = [wait for wait in self.waits if wait.count]
        return [*(line for load in self.lanes for line in load.lines()), "waits over the last hour:" if waited else "waits over the last hour: no run started",
                *(f"  {wait.described}" for wait in waited)]

    def json(self) -> dict[str, object]:
        return {"lanes": [load.json() for load in self.lanes],
                "waits": [{"priority": wait.priority.label, "runs": wait.count, "longest_seconds": round(wait.longest_seconds), "average_seconds": round(wait.average_seconds)}
                          for wait in self.waits]}
