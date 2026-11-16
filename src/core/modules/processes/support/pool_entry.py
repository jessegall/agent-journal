from dataclasses import dataclass


@dataclass(frozen=True)
class PoolEntry:
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
    previous_priority: str = ""
    parent_line: str = ""

    def json(self) -> dict[str, object]:
        return {"line": self.line, "class": self.class_name, "priority": self.priority, "starter": self.starter, "seconds": round(self.seconds),
                "slot_cost": self.slot_cost, "kind": self.kind, "run_id": self.run_id,
                "reason": self.reason, "raised_from": self.previous_priority, "parent_line": self.parent_line}

    @property
    def described(self) -> str:
        return f"{self.line} ({self.class_name}, {self.priority}, {self.starter}, {self.seconds:.0f} s)"
