from dataclasses import dataclass
from engine.enums.execution_priority import ExecutionPriority


@dataclass(frozen=True)
class PriorityWait:
    """How the runs of one priority waited over the last hour: how many started, the longest and the average wait."""

    priority: ExecutionPriority
    count: int
    longest_seconds: float
    average_seconds: float

    @property
    def described(self) -> str:
        return f"{self.priority.label}: {self.count} runs started, longest wait {self.longest_seconds:.0f} s, average {self.average_seconds:.0f} s"
