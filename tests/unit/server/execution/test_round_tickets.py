from datetime import timedelta

import pytest

from engine.enums.execution_priority import ExecutionPriority
from engine.execution.execution_order import ExecutionOrder
from engine.execution.limits.default_lane_limits import DEFAULT_LANE_LIMITS
from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from server.execution.execution_priorities import ExecutionPriorities
from server.execution.execution_queue import ExecutionQueue
from server.execution.round_tickets import RoundTickets
from server.execution.session_starters import SessionStarters

RAISE_SECONDS = 10


def round_tickets(tmp_path) -> RoundTickets:
    return RoundTickets(ExecutionQueue(ExecutionOrder(DEFAULT_LANE_LIMITS), Clock()), ExecutionPriorities(SessionStarters(JournalHome(tmp_path))), Clock())


def test_tick_handler_run_takes_a_background_ticket(tmp_path):
    tickets = round_tickets(tmp_path)
    with tickets.tick_turn("read running outputs"):
        entries = tickets.queue.read()
    assert [(entry.is_running, entry.ticket.priority, entry.ticket.execution_class.name) for entry in entries] == [(True, ExecutionPriority.BACKGROUND, "tick handler")]


def test_ticket_released_when_handler_ends_or_raises(tmp_path):
    tickets = round_tickets(tmp_path)
    with pytest.raises(RuntimeError), tickets.tick_turn("run slots"):
        raise RuntimeError("the handler failed")
    assert tickets.queue.read() == ()


def test_each_listener_event_is_its_own_ticket(tmp_path):
    tickets = round_tickets(tmp_path)
    held = []
    for event in ("task.created", "task.updated"):
        with tickets.event_turn(event):
            held.extend((entry.ticket.line, entry.ticket.execution_class.name) for entry in tickets.queue.read())
    assert held == [("task.created", "listener event"), ("task.updated", "listener event")] and tickets.queue.read() == ()


def test_fourth_background_tick_waits_even_with_room(tmp_path):
    priorities = ExecutionPriorities(SessionStarters(JournalHome(tmp_path)))
    now = Clock().timestamp()
    running = [priorities.tick_ticket(f"handler {number}", now) for number in range(3)]
    fourth = priorities.tick_ticket("handler 4", now)
    assert ExecutionOrder(DEFAULT_LANE_LIMITS).starting([fourth], running, now, False) == ()


def test_background_tick_raised_to_normal_after_ten_seconds(tmp_path):
    entered = Clock().timestamp()
    waiting = ExecutionPriorities(SessionStarters(JournalHome(tmp_path))).tick_ticket("process pruning", entered)
    raised = ExecutionOrder(DEFAULT_LANE_LIMITS).raised([waiting], Timestamp(entered.value + timedelta(seconds=RAISE_SECONDS)), False)
    assert [ticket.priority for ticket in raised] == [ExecutionPriority.NORMAL]
