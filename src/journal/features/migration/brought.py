from dataclasses import dataclass, field


@dataclass(frozen=True)
class Brought:
    """What one kind brought across: how many rows, and each row left behind with why."""

    kind: str
    count: int = 0
    skipped: tuple[str, ...] = field(default_factory=tuple)

    def line(self) -> str:
        return f"| {self.kind} | {self.count} | {len(self.skipped)} |"
