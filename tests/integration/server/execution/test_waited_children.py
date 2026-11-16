from dataclasses import replace
from contextlib import ExitStack
from pathlib import Path

from engine.enums.execution_length import ExecutionLength
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.process_type import ProcessType
from engine.execution.current_execution import CurrentExecution
from engine.execution.execution_order import ExecutionOrder
from engine.execution.limits.default_lane_limits import DEFAULT_POOL_LIMITS
from engine.journal.journal_home import JournalHome
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.placed_run import PlacedRun
from engine.time.clock import Clock
from server.execution.execution_priorities import ExecutionPriorities
from server.execution.execution_queue import ExecutionQueue
from server.execution.session_starters import SessionStarters
from server.execution.ticket_start_check import TicketStartCheck

GIT_STATUS = PlacedRun(ExecutionRequest(["git", "status"], Path("/work"), ProcessType.QUICK, 10), None, False)


def door(tmp_path) -> tuple[TicketStartCheck, ExecutionPriorities]:
    priorities = ExecutionPriorities(SessionStarters(JournalHome(tmp_path)))
    return TicketStartCheck(ExecutionQueue(ExecutionOrder(DEFAULT_POOL_LIMITS), Clock()), priorities, Clock()), priorities


# immediate tickets fill each lane to its capacity, since they never wait
def full_pools(start_check: TicketStartCheck, priorities: ExecutionPriorities, running: ExitStack) -> None:
    current_time = Clock().timestamp()
    for number in range(DEFAULT_POOL_LIMITS.capacity(ExecutionLength.SHORT)):
        running.enter_context(start_check.queue.admitted(replace(priorities.journal_run_ticket(f"git log {number}", current_time), priority=ExecutionPriority.IMMEDIATE)))
    for number in range(DEFAULT_POOL_LIMITS.capacity(ExecutionLength.INSTANT)):
        running.enter_context(start_check.queue.admitted(priorities.release_ticket(f"release {number}", current_time)))


def current_execution(ticket):
    return CurrentExecution(ticket.priority, "hook", ticket.line, ticket).applied()


def test_child_starts_with_both_lanes_full(tmp_path):
    start_check, priorities = door(tmp_path)
    parent = priorities.release_ticket("answer lost", Clock().timestamp())
    with ExitStack() as running:
        full_pools(start_check, priorities, running)
        with current_execution(parent), start_check.admitted(GIT_STATUS):
            children = [entry for entry in start_check.queue.read() if entry.ticket.parent is not None]
    assert [entry.is_running for entry in children] == [True]


def test_child_listed_under_its_parent(tmp_path):
    start_check, priorities = door(tmp_path)
    parent = priorities.hook_ticket("", "PreToolUse", Clock().timestamp())
    with current_execution(parent), start_check.admitted(GIT_STATUS):
        child = start_check.queue.read()[0].ticket
    assert child.parent == parent and child.line == "git status"


def test_child_of_child_works(tmp_path):
    start_check, priorities = door(tmp_path)
    parent = priorities.hook_ticket("", "Stop", Clock().timestamp())
    with current_execution(parent), start_check.admitted(GIT_STATUS):
        child = start_check.queue.read()[0].ticket
        with current_execution(child), start_check.admitted(GIT_STATUS):
            grandchild = [entry.ticket for entry in start_check.queue.read() if entry.ticket.parent == child]
    assert len(grandchild) == 1 and start_check.queue.read() == ()


def test_child_writes_at_least_at_its_parents_priority(tmp_path):
    start_check, priorities = door(tmp_path)
    parent = priorities.hook_ticket("", "PreToolUse", Clock().timestamp())
    with current_execution(parent), start_check.admitted(GIT_STATUS):
        child = start_check.queue.read()[0].ticket
    assert child.priority >= parent.priority
