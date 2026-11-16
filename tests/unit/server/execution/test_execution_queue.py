from contextlib import ExitStack
from dataclasses import replace
from datetime import datetime, timezone

import pytest

from engine.enums.execution_length import ExecutionLength
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.starter_type import StarterType
from engine.execution.limits.default_lane_limits import DEFAULT_POOL_LIMITS
from engine.execution.classes.execution_class import ExecutionClass
from engine.execution.execution_order import ExecutionOrder
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_ticket import ExecutionTicket
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from server.errors.pool_busy_error import PoolBusyError
from server.execution.execution_queue import ExecutionQueue

ENTERED = Timestamp(datetime(2026, 11, 13, 12, tzinfo=timezone.utc))
CAPACITY = DEFAULT_POOL_LIMITS.capacity(ExecutionLength.INSTANT)
RESERVED_LIMIT = DEFAULT_POOL_LIMITS.priority_limit(ExecutionLength.INSTANT, ExecutionPriority.RESERVED).running_limit


def ticket(priority: ExecutionPriority, line: str = "PreToolUse", agent: int = 1) -> ExecutionTicket:
    execution_class = ExecutionClass(f"{priority.name.lower()} hook", ExecutionLength.INSTANT, 1, priority)
    return ExecutionTicket(execution_class, priority, priority, ExecutionStarter(StarterType.HELPER, agent_id=agent, agent_role="worker"), line, ENTERED, ENTERED)


def queue() -> ExecutionQueue:
    return ExecutionQueue(ExecutionOrder(replace(DEFAULT_POOL_LIMITS, starter_caps={pool: CAPACITY for pool in ExecutionLength})), Clock())


def test_immediate_hook_starts_in_a_full_lane():
    pool = queue()
    with ExitStack() as running:
        for number in range(RESERVED_LIMIT):
            running.enter_context(pool.admitted(ticket(ExecutionPriority.RESERVED, agent=number), owner=f"session-{number}"))
        with pool.admitted(ticket(ExecutionPriority.IMMEDIATE), owner="main") as immediate:
            assert immediate.ticket.priority is ExecutionPriority.IMMEDIATE


def test_wait_past_limit_names_the_holders():
    pool = queue()
    with ExitStack() as running:
        for number in range(RESERVED_LIMIT):
            running.enter_context(pool.admitted(ticket(ExecutionPriority.RESERVED, f"hook {number}", agent=number), owner=f"session-{number}"))
        with pytest.raises(PoolBusyError, match="waiting for reserved hook at reserved: hook 0"):
            with pool.admitted(ticket(ExecutionPriority.RESERVED, agent=99), owner="late", wait_limit_seconds=0):
                pass


def test_release_on_exception_gives_back_room():
    pool = queue()
    with pytest.raises(RuntimeError):
        with pool.admitted(ticket(ExecutionPriority.RESERVED), owner="session-1"):
            raise RuntimeError("the hook failed")
    assert pool.read() == ()


def test_status_lists_running_and_waiting_with_class_and_line():
    pool = queue()
    with pool.admitted(ticket(ExecutionPriority.RESERVED, "Stop"), owner="session-1"):
        entries = pool.read()
    assert [(entry.is_running, entry.described) for entry in entries] == [(True, "reserved hook at reserved: Stop")]
