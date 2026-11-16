from dataclasses import dataclass, field


from core.modules.processes.support.pool_entry import PoolEntry


@dataclass(frozen=True)
class PoolLoad:
    """One lane as a person reads it: the slots its runs use against its capacity, whether it runs over or is
    halted, and why (the halt's type, command, update or restart, and its reason), and what runs and what
    waits in it."""

    lane: str
    used: int
    capacity: int
    is_overloaded: bool = False
    running: tuple[PoolEntry, ...] = field(default_factory=tuple)
    waiting: tuple[PoolEntry, ...] = field(default_factory=tuple)
    halt_type: str = ""
    halt_reason: str = ""

    @property
    def is_halted(self) -> bool:
        return bool(self.halt_type)

    def json(self) -> dict[str, object]:
        return {"lane": self.lane, "used": self.used, "capacity": self.capacity, "over_capacity": self.is_overloaded, "halted": self.is_halted,
                "halt_type": self.halt_type, "halt_reason": self.halt_reason,
                "running": [entry.json() for entry in self.running], "waiting": [entry.json() for entry in self.waiting]}

    def lines(self) -> list[str]:
        over = " (over capacity)" if self.is_overloaded else ""
        halted = {"": "", "command": " (paused)"}.get(self.halt_type, " (held)")
        return [f"{self.lane} lane: {self.used} of {self.capacity} slots in use{over}{halted}, {len(self.waiting)} waiting",
                *(f"  runs: {entry.described}" for entry in self.running), *(f"  waits: {entry.described}, {entry.reason}" for entry in self.waiting)]


