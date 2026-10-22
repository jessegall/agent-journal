from dataclasses import dataclass


@dataclass(frozen=True)
class AnswerTime:
    """How long one kind of answer takes: the count measured, the running total and the slowest, read from the statistics under one prefix."""

    count: int
    total_ms: int
    slowest_ms: int

    @classmethod
    def read(cls, numbers: dict[str, int], prefix: str) -> "AnswerTime":
        return cls(numbers.get(f"{prefix}.count", 0), numbers.get(f"{prefix}.total_ms", 0), numbers.get(f"{prefix}.slowest_ms", 0))

    def average_ms(self) -> int:
        return round(self.total_ms / self.count) if self.count else 0

    def as_data(self) -> dict:
        return {"count": self.count, "average_ms": self.average_ms(), "slowest_ms": self.slowest_ms}
