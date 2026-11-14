from dataclasses import dataclass

from engine.enums.execution_priority import ExecutionPriority
from engine.execution.classes.execution_class import ExecutionClass
from engine.execution.execution_starter import ExecutionStarter
from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class ExecutionTicket:
    """An execution's place in its lane: its class and priorities, who started it, its line and times, the ticket
    that waits for it, whether a reader request for it is open, and the run it stands for, 0 before it has one."""

    execution_class: ExecutionClass
    first_priority: ExecutionPriority
    priority: ExecutionPriority
    starter: ExecutionStarter
    line: str
    entered_at: Timestamp
    raised_at: Timestamp
    parent: "ExecutionTicket | None" = None
    has_open_reader_request: bool = False
    run_id: int = 0

    def waited_child(self, execution_class: ExecutionClass, line: str, entered_at: Timestamp) -> "ExecutionTicket":
        priority = max(execution_class.priority, self.priority)
        return ExecutionTicket(execution_class, priority, priority, self.starter, line, entered_at, entered_at, self)
