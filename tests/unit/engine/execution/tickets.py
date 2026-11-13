from datetime import datetime, timedelta, timezone

from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.starter_type import StarterType
from engine.execution.execution_class import ExecutionClass
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_ticket import ExecutionTicket
from engine.time.timestamp import Timestamp

START = Timestamp(datetime(2026, 11, 13, 12, 0, tzinfo=timezone.utc))
WORKER = ExecutionStarter(StarterType.HELPER, agent_id=849, agent_role="worker")


def seconds_after_start(seconds: float) -> Timestamp:
    return Timestamp(START.value + timedelta(seconds=seconds))


def ticket(priority: ExecutionPriority, lane: ExecutionLane = ExecutionLane.SHORT, slot_cost: int = 1, entered_second: float = 0,
           starter: ExecutionStarter = WORKER, line: str = "ls") -> ExecutionTicket:
    execution_class = ExecutionClass(f"{lane} {priority.name.lower()}", lane, slot_cost, priority)
    return ExecutionTicket(execution_class, priority, priority, starter, line, seconds_after_start(entered_second), seconds_after_start(entered_second))
