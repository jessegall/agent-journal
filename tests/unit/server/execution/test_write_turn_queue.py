import threading
from datetime import timedelta

import pytest

from engine.enums.execution_priority import ExecutionPriority
from engine.execution.current_execution import CurrentExecution
from engine.testing.fakes.manual_clock import ManualClock
from server.errors.write_turn_busy_error import WriteTurnBusyError
from server.execution.write_turn_queue import WriteTurnQueue

LIMIT_SECONDS = 30.0


class Harness:
    """A write turn queue on a hand-set clock, with a log it keeps, and threads that ask for the turn in order."""

    def __init__(self) -> None:
        self.clock = ManualClock()
        self.logged: list[str] = []
        self.queue = WriteTurnQueue(self.clock, LIMIT_SECONDS, self.logged.append)
        self.order: list[str] = []
        self.threads: list[threading.Thread] = []

    def ask(self, name: str, priority: ExecutionPriority) -> threading.Event:
        asked = threading.Event()

        def run() -> None:
            with CurrentExecution(priority, name, name).held():
                asked.set()
                with self.queue.write_turn():
                    self.order.append(name)

        thread = threading.Thread(target=run)
        self.threads.append(thread)
        thread.start()
        asked.wait()
        self.wait_until_waiting(len(self.threads))
        return asked

    def wait_until_waiting(self, count: int) -> None:
        with self.queue.changed:
            self.queue.changed.wait_for(lambda: len(self.queue.waiting) >= count or not any(thread.is_alive() for thread in self.threads))

    def finish(self) -> list[str]:
        for thread in self.threads:
            thread.join()
        return self.order


@pytest.fixture
def harness() -> Harness:
    return Harness()


def held_while(harness: Harness, asks: list[tuple[str, ExecutionPriority]]) -> list[str]:
    with harness.queue.write_turn():
        for name, priority in asks:
            harness.ask(name, priority)
    return harness.finish()


def test_immediate_goes_next(harness):
    assert held_while(harness, [("normal", ExecutionPriority.NORMAL), ("immediate", ExecutionPriority.IMMEDIATE)]) == ["immediate", "normal"]


def test_higher_priority_before_lower(harness):
    assert held_while(harness, [("background", ExecutionPriority.BACKGROUND), ("agent", ExecutionPriority.AGENT)]) == ["agent", "background"]


def test_equal_priority_by_ask_order(harness):
    assert held_while(harness, [("first", ExecutionPriority.NORMAL), ("second", ExecutionPriority.NORMAL)]) == ["first", "second"]


def test_waiting_ask_is_raised_after_its_step(harness):
    with harness.queue.write_turn():
        harness.ask("background", ExecutionPriority.BACKGROUND)
        harness.clock.advance(timedelta(seconds=10))
        harness.queue.wake_waiters()
        harness.ask("normal", ExecutionPriority.NORMAL)
    assert harness.finish() == ["background", "normal"]


def test_raising_never_reaches_immediate(harness):
    with harness.queue.write_turn():
        harness.ask("reserved", ExecutionPriority.RESERVED)
        harness.clock.advance(timedelta(seconds=20))
        harness.queue.wake_waiters()
        assert harness.queue.waiting[0].priority is ExecutionPriority.RESERVED
    harness.finish()


def test_turn_given_back_on_exception(harness):
    with pytest.raises(KeyError), harness.queue.write_turn():
        raise KeyError("failed write")
    assert harness.queue.holder is None


def test_wait_past_limit_names_the_holder(harness):
    failures: list[BaseException] = []

    def ask() -> None:
        try:
            with CurrentExecution(ExecutionPriority.NORMAL, "late", "late").held(), harness.queue.write_turn():
                pass
        except WriteTurnBusyError as error:
            failures.append(error)

    with CurrentExecution(ExecutionPriority.AGENT, "hook", "task close 4").held(), harness.queue.write_turn():
        waiter = threading.Thread(target=ask)
        waiter.start()
        harness.threads.append(waiter)
        harness.wait_until_waiting(1)
        harness.clock.advance(timedelta(seconds=LIMIT_SECONDS))
        harness.queue.wake_waiters()
        waiter.join()
    assert "hook at agent priority: task close 4" in str(failures[0])


def test_slow_holder_is_logged_with_class_priority_line(harness):
    with CurrentExecution(ExecutionPriority.BACKGROUND, "tick", "prune events").held(), harness.queue.write_turn():
        harness.clock.advance(timedelta(seconds=2))
    assert harness.logged == ["the database write turn was held 2.0 seconds by tick at background priority: prune events"]


def test_nested_ask_in_same_thread_passes(harness):
    with harness.queue.write_turn(), harness.queue.write_turn():
        assert harness.queue.holder is not None
    assert harness.queue.holder is None
