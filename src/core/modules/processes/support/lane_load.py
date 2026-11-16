from core.modules.processes.support.priority_waits import PriorityWait
from dataclasses import dataclass, field


@dataclass(frozen=True)
class LaneEntry:
    """One execution of a lane as a person reads it: its line, class, priority and starter, how long it has
    run or waited, the slots it takes, its kind (a run's command category or plugin, the class of the
    journal's own work), the run it stands for (0 for the instant lane, which has no runs), why it waits, the
    priority it was raised from, and the line of the execution it is a waited child of."""

    line: str
    class_name: str
    priority: str
    starter: str
    seconds: float
    slot_cost: int
    kind: str
    run_id: int = 0
    reason: str = ""
    raised_from: str = ""
    parent_line: str = ""

    def json(self) -> dict[str, object]:
        return {"line": self.line, "class": self.class_name, "priority": self.priority, "starter": self.starter, "seconds": round(self.seconds),
                "slot_cost": self.slot_cost, "kind": self.kind, "run_id": self.run_id,
                "reason": self.reason, "raised_from": self.raised_from, "parent_line": self.parent_line}

    @property
    def described(self) -> str:
        return f"{self.line} ({self.class_name}, {self.priority}, {self.starter}, {self.seconds:.0f} s)"


@dataclass(frozen=True)
class LaneLoad:
    """One lane as a person reads it: the slots its runs use against its capacity, whether it runs over or is
    halted, and why (the halt's type, command, update or restart, and its reason), and what runs and what
    waits in it."""

    lane: str
    used: int
    capacity: int
    is_over: bool = False
    running: tuple[LaneEntry, ...] = field(default_factory=tuple)
    waiting: tuple[LaneEntry, ...] = field(default_factory=tuple)
    halt_type: str = ""
    halt_reason: str = ""

    @property
    def is_halted(self) -> bool:
        return bool(self.halt_type)

    def json(self) -> dict[str, object]:
        return {"lane": self.lane, "used": self.used, "capacity": self.capacity, "over_capacity": self.is_over, "halted": self.is_halted,
                "halt_type": self.halt_type, "halt_reason": self.halt_reason,
                "running": [entry.json() for entry in self.running], "waiting": [entry.json() for entry in self.waiting]}

    def lines(self) -> list[str]:
        over = " (over capacity)" if self.is_over else ""
        halted = {"": "", "command": " (paused)"}.get(self.halt_type, " (held)")
        return [f"{self.lane} lane: {self.used} of {self.capacity} slots in use{over}{halted}, {len(self.waiting)} waiting",
                *(f"  runs: {entry.described}" for entry in self.running), *(f"  waits: {entry.described}, {entry.reason}" for entry in self.waiting)]


@dataclass(frozen=True)
class ExecutionSnapshot:
    """Every lane and the waits of the last hour, read once, as lines and as JSON."""

    lanes: tuple[LaneLoad, ...]
    waits: tuple[PriorityWait, ...]

    def lane(self, lane: str) -> LaneLoad:
        return next(read for read in self.lanes if read.lane == lane)

    def lines(self) -> list[str]:
        waited = [wait for wait in self.waits if wait.count]
        return [*(line for read in self.lanes for line in read.lines()), "waits over the last hour:" if waited else "waits over the last hour: no run started",
                *(f"  {wait.described}" for wait in waited)]

    def json(self) -> dict[str, object]:
        return {"lanes": [read.json() for read in self.lanes],
                "waits": [{"priority": wait.priority.label, "runs": wait.count, "longest_seconds": round(wait.longest_seconds), "average_seconds": round(wait.average_seconds)}
                          for wait in self.waits]}
