import threading
from dataclasses import dataclass

from engine.enums.execution_priority import ExecutionPriority
from engine.execution.current_execution import CurrentExecution

# how long an ask waits at each priority before it is raised one step, from the instant lane of doc 1266
RAISE_STEP_SECONDS = {ExecutionPriority.BACKGROUND: 10.0, ExecutionPriority.NORMAL: 3.0, ExecutionPriority.AGENT: 1.0, ExecutionPriority.RESERVED: 0.5}


@dataclass
class WaitingAsk:
    """One thread's ask for the write turn: who asks, its place in line, when it asked and when its current wait
    for a raise started."""

    execution: CurrentExecution
    priority: ExecutionPriority
    number: int
    thread: threading.Thread
    requested_at: float
    step_started_at: float

    @property
    def place(self) -> tuple[int, int]:
        return -self.priority, self.number

    def raise_priority(self, current_time: float) -> None:
        if self.priority.is_unlimited or self.priority >= ExecutionPriority.RESERVED:
            return
        if current_time - self.step_started_at >= RAISE_STEP_SECONDS[self.priority]:
            self.priority, self.step_started_at = self.priority.raised(), current_time

    def raise_delay(self, current_time: float) -> float:
        if self.priority.is_unlimited or self.priority >= ExecutionPriority.RESERVED:
            return float("inf")
        return max(0.0, RAISE_STEP_SECONDS[self.priority] - (current_time - self.step_started_at))

    def described(self) -> str:
        return f"{self.execution.class_name or 'a write'} at {self.priority.name.lower()} priority: {self.execution.line or 'no line'}"
