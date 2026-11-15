import sys
from dataclasses import dataclass

from engine.enums.execution_length import ExecutionLength
from engine.enums.execution_priority import ExecutionPriority

# a limit no count of running executions reaches
UNLIMITED = sys.maxsize


@dataclass(frozen=True)
class ExecutionClass:
    """A row of the class table: the lane an execution waits in, the slot units it takes, the priority it starts
    with and how many of its class may run at once."""

    name: str
    lane: ExecutionLength
    slot_cost: int
    priority: ExecutionPriority
    class_limit: int = UNLIMITED
    line_pattern: str = ""
    plugin: str = ""
