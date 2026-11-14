import threading

import pytest

from engine.execution.execution_order import ExecutionOrder
from engine.execution.limits.default_lane_limits import DEFAULT_LANE_LIMITS
from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock
from server.errors.client_left_error import ClientLeftError
from server.execution.execution_priorities import ExecutionPriorities
from server.execution.execution_queue import ExecutionQueue
from server.execution.session_starters import SessionStarters

JOIN_SECONDS = 5


def tickets(tmp_path) -> ExecutionPriorities:
    return ExecutionPriorities(SessionStarters(JournalHome(tmp_path)))


def test_thread_death_gives_back_room_limits_and_turn(tmp_path):
    queue = ExecutionQueue(ExecutionOrder(DEFAULT_LANE_LIMITS), Clock())

    def dying() -> None:
        with queue.admitted(tickets(tmp_path).event_ticket("task.created", Clock().timestamp())):
            raise RuntimeError("the listener died")

    thread = threading.Thread(target=lambda: pytest.raises(RuntimeError, dying))
    thread.start()
    thread.join(JOIN_SECONDS)
    assert queue.read() == ()


def test_crash_is_named_in_the_server_log(tmp_path):
    logged = []
    queue = ExecutionQueue(ExecutionOrder(DEFAULT_LANE_LIMITS), Clock(), logged.append)
    with pytest.raises(RuntimeError), queue.admitted(tickets(tmp_path).tick_ticket("run slots", Clock().timestamp())):
        raise RuntimeError("the handler died")
    assert logged == ["tick handler at background: run slots ended with RuntimeError: the handler died"]


def test_client_left_before_start_leaves_no_ticket(tmp_path):
    queue = ExecutionQueue(ExecutionOrder(DEFAULT_LANE_LIMITS), Clock())
    holders = [queue.admitted(tickets(tmp_path).event_ticket(f"event {number}", Clock().timestamp())) for number in range(3)]
    for holder in holders:
        holder.__enter__()
    with pytest.raises(ClientLeftError), queue.admitted(tickets(tmp_path).event_ticket("late", Clock().timestamp()), is_client_waiting=lambda: False):
        pass
    for holder in holders:
        holder.__exit__(None, None, None)
    assert queue.read() == ()
