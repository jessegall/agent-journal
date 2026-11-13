import threading
import pytest

from engine.enums.execution_priority import ExecutionPriority
from engine.execution.current_execution import CurrentExecution
from engine.time.clock import Clock
from server.errors.write_turn_busy_error import WriteTurnBusyError
from server.execution.write_turn_queue import WriteTurnQueue

LIMIT_SECONDS = 30.0


class SetClock(Clock):
    """A clock that stands still until a test moves it on."""

    def __init__(self) -> None:
        self.seconds = 0.0

    def epoch_seconds(self) -> float:
        return self.seconds


class TurnThreads:
    """A write turn queue on a set clock, with the log it writes, and threads that ask for the turn in order."""

    def __init__(self) -> None:
        self.clock = SetClock()
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
def turn_threads() -> TurnThreads:
    return TurnThreads()


def turn_order(turn_threads: TurnThreads, asks: list[tuple[str, ExecutionPriority]]) -> list[str]:
    with turn_threads.queue.write_turn():
        for name, priority in asks:
            turn_threads.ask(name, priority)
    return turn_threads.finish()


def test_immediate_goes_next(turn_threads):
    assert turn_order(turn_threads, [("normal", ExecutionPriority.NORMAL), ("immediate", ExecutionPriority.IMMEDIATE)]) == ["immediate", "normal"]


def test_higher_priority_before_lower(turn_threads):
    assert turn_order(turn_threads, [("background", ExecutionPriority.BACKGROUND), ("agent", ExecutionPriority.AGENT)]) == ["agent", "background"]


def test_equal_priority_by_ask_order(turn_threads):
    assert turn_order(turn_threads, [("first", ExecutionPriority.NORMAL), ("second", ExecutionPriority.NORMAL)]) == ["first", "second"]


def test_waiting_ask_is_raised_after_its_step(turn_threads):
    with turn_threads.queue.write_turn():
        turn_threads.ask("background", ExecutionPriority.BACKGROUND)
        turn_threads.clock.seconds += 10
        turn_threads.queue.wake_waiters()
        turn_threads.ask("normal", ExecutionPriority.NORMAL)
    assert turn_threads.finish() == ["background", "normal"]


def test_raising_never_reaches_immediate(turn_threads):
    with turn_threads.queue.write_turn():
        turn_threads.ask("reserved", ExecutionPriority.RESERVED)
        turn_threads.clock.seconds += 20
        turn_threads.queue.wake_waiters()
        assert turn_threads.queue.waiting[0].priority is ExecutionPriority.RESERVED
    turn_threads.finish()


def test_turn_given_back_on_exception(turn_threads):
    with pytest.raises(KeyError), turn_threads.queue.write_turn():
        raise KeyError("failed write")
    assert turn_threads.queue.holder is None


def test_wait_past_limit_names_the_holder(turn_threads):
    failures: list[BaseException] = []

    def ask() -> None:
        try:
            with CurrentExecution(ExecutionPriority.NORMAL, "late", "late").held(), turn_threads.queue.write_turn():
                pass
        except WriteTurnBusyError as error:
            failures.append(error)

    with CurrentExecution(ExecutionPriority.AGENT, "hook", "task close 4").held(), turn_threads.queue.write_turn():
        waiter = threading.Thread(target=ask)
        waiter.start()
        turn_threads.threads.append(waiter)
        turn_threads.wait_until_waiting(1)
        turn_threads.clock.seconds += LIMIT_SECONDS
        turn_threads.queue.wake_waiters()
        waiter.join()
    assert "hook at agent priority: task close 4" in str(failures[0])


def test_slow_holder_is_logged_with_class_priority_line(turn_threads):
    with CurrentExecution(ExecutionPriority.BACKGROUND, "tick", "prune events").held(), turn_threads.queue.write_turn():
        turn_threads.clock.seconds += 2
    assert turn_threads.logged == ["the database write turn was held 2.0 seconds by tick at background priority: prune events"]


def test_nested_ask_in_same_thread_passes(turn_threads):
    with turn_threads.queue.write_turn(), turn_threads.queue.write_turn():
        assert turn_threads.queue.holder is not None
    assert turn_threads.queue.holder is None
