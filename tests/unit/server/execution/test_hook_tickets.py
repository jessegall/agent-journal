from dataclasses import replace

import pytest

from engine.enums.execution_length import ExecutionLength
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.execution_order import ExecutionOrder
from engine.execution.limits.default_lane_limits import DEFAULT_POOL_LIMITS
from engine.time.clock import Clock
from server.errors.client_gone_error import ClientGoneError
from server.execution.execution_queue import ExecutionQueue
from server.execution.tickets.hook_tickets import HookTickets
from server.execution.tickets.hook_turn import HookTurn

SESSION = "main-session"
HOOK_LIMIT_SECONDS = 5.0


def hook_tickets() -> HookTickets:
    limits = replace(DEFAULT_POOL_LIMITS, starter_caps={pool: DEFAULT_POOL_LIMITS.capacity(ExecutionLength.INSTANT) for pool in ExecutionLength})
    return HookTickets(ExecutionQueue(ExecutionOrder(limits), Clock()), Clock())


def test_a_main_agent_hook_behind_its_own_sessions_command_leaves_the_lane_once_its_client_is_gone():
    tickets = hook_tickets()
    with tickets.admitted(HookTurn(ExecutionPriority.IMMEDIATE, HOOK_LIMIT_SECONDS, SESSION, "plugin upgrade")):
        with pytest.raises(ClientGoneError):
            with tickets.admitted(HookTurn(ExecutionPriority.IMMEDIATE, HOOK_LIMIT_SECONDS, SESSION, "pre_tool_use", lambda: False)):
                pass
    assert tickets.queue.read() == ()
