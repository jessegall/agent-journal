from contextlib import ExitStack

import pytest

from engine.database.errors.wait_in_write_turn_error import WaitInWriteTurnError
from engine.database.never_waiting_write_turns import NeverWaitingWriteTurns
from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.execution_order import ExecutionOrder
from engine.execution.limits.default_lane_limits import DEFAULT_LANE_LIMITS
from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock
from server.execution.execution_priorities import ExecutionPriorities
from server.execution.execution_queue import ExecutionQueue
from server.execution.session_starters import SessionStarters

CAPACITY = DEFAULT_LANE_LIMITS.capacity(ExecutionLane.INSTANT)


def priorities(tmp_path) -> ExecutionPriorities:
    return ExecutionPriorities(SessionStarters(JournalHome(tmp_path)))


def release(tmp_path, line: str):
    return priorities(tmp_path).command_ticket("", line, Clock().timestamp())


@pytest.mark.parametrize("line", ["process end 7 --exit-code 0", "process part-end 7 --position 1 --exit-code 0", "queue halt 'a deploy'", "queue resume"])
def test_a_line_that_gives_capacity_back_is_immediate(tmp_path, line):
    assert release(tmp_path, line).priority is ExecutionPriority.IMMEDIATE and release(tmp_path, line).execution_class.name == "release work"


def test_process_end_is_immediate_with_every_lane_full(tmp_path):
    full = [priorities(tmp_path).event_ticket(f"event {number}", Clock().timestamp()) for number in range(CAPACITY)]
    end = release(tmp_path, "process end 7 --exit-code 0")
    assert ExecutionOrder(DEFAULT_LANE_LIMITS).starting([end], full, Clock().timestamp(), False) == (end,)


def test_answer_lost_is_immediate(tmp_path):
    assert priorities(tmp_path).release_ticket("answer lost", Clock().timestamp()).priority is ExecutionPriority.IMMEDIATE


def test_waiter_does_not_hold_the_write_turn(tmp_path):
    queue = ExecutionQueue(ExecutionOrder(DEFAULT_LANE_LIMITS), Clock())
    events = [priorities(tmp_path).event_ticket(f"event {number}", Clock().timestamp()) for number in range(4)]
    with ExitStack() as running:
        for ticket in events[:3]:
            running.enter_context(queue.admitted(ticket))
        with NeverWaitingWriteTurns().write_turn(), pytest.raises(WaitInWriteTurnError):
            with queue.admitted(events[3]):
                pass
