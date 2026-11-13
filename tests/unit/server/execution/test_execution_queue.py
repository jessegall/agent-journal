from contextlib import ExitStack
from dataclasses import replace
from datetime import datetime, timezone

import pytest

from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.starter_type import StarterType
from engine.execution.default_lane_limits import DEFAULT_LANE_LIMITS
from engine.execution.execution_class import ExecutionClass
from engine.execution.execution_order import ExecutionOrder
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_ticket import ExecutionTicket
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from server.errors.hook_database_busy_error import HookDatabaseBusyError
from server.execution.execution_queue import ExecutionQueue

ENTERED = Timestamp(datetime(2026, 11, 13, 12, tzinfo=timezone.utc))
CAPACITY = DEFAULT_LANE_LIMITS.capacity(ExecutionLane.INSTANT)
RESERVED_LIMIT = DEFAULT_LANE_LIMITS.priority_limit(ExecutionLane.INSTANT, ExecutionPriority.RESERVED).running_limit


def ticket(priority: ExecutionPriority, line: str = "PreToolUse", agent: int = 1) -> ExecutionTicket:
    execution_class = ExecutionClass(f"{priority.name.lower()} hook", ExecutionLane.INSTANT, 1, priority)
    return ExecutionTicket(execution_class, priority, priority, ExecutionStarter(StarterType.HELPER, agent_id=agent, agent_role="worker"), line, ENTERED, ENTERED)


def queue() -> ExecutionQueue:
    return ExecutionQueue(ExecutionOrder(replace(DEFAULT_LANE_LIMITS, starter_caps={lane: CAPACITY for lane in ExecutionLane})), Clock())


def test_immediate_hook_starts_in_a_full_lane():
    lane = queue()
    with ExitStack() as running:
        for number in range(RESERVED_LIMIT):
            running.enter_context(lane.admitted(ticket(ExecutionPriority.RESERVED, agent=number), owner=f"session-{number}"))
        with lane.admitted(ticket(ExecutionPriority.IMMEDIATE), owner="main") as immediate:
            assert immediate.ticket.priority is ExecutionPriority.IMMEDIATE


def test_wait_past_limit_names_the_holders():
    lane = queue()
    with ExitStack() as running:
        for number in range(RESERVED_LIMIT):
            running.enter_context(lane.admitted(ticket(ExecutionPriority.RESERVED, f"hook {number}", agent=number), owner=f"session-{number}"))
        with pytest.raises(HookDatabaseBusyError, match="waiting for reserved hook at reserved: hook 0"):
            with lane.admitted(ticket(ExecutionPriority.RESERVED, agent=99), owner="late", wait_limit_seconds=0):
                pass


def test_release_on_exception_gives_back_room():
    lane = queue()
    with pytest.raises(RuntimeError):
        with lane.admitted(ticket(ExecutionPriority.RESERVED), owner="session-1"):
            raise RuntimeError("the hook failed")
    assert lane.read() == ()


def test_status_lists_running_and_waiting_with_class_and_line():
    lane = queue()
    with lane.admitted(ticket(ExecutionPriority.RESERVED, "Stop"), owner="session-1"):
        entries = lane.read()
    assert [(entry.is_running, entry.described) for entry in entries] == [(True, "reserved hook at reserved: Stop")]
