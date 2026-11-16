import threading

import pytest

from core.modules.processes.models.enums.process_setting import ProcessSetting
from engine.container.container import Container
from engine.database.database import Database
from engine.module.journal_container import synced_container
from engine.module.module_finder import ModuleFinder
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from server.tick.ticker import TIMED_JOB_COUNT, Ticker

JOIN_SECONDS = 5.0
WAIT_SECONDS = 30.0
PRUNING_SECONDS = 600
OUTPUT_READER_SECONDS = 1
TIMED_JOBS_KEY = ProcessSetting.TIMED_JOBS_AT_ONCE.key


class TickClock:
    def __init__(self) -> None:
        self.now = 0.0

    def __call__(self) -> float:
        return self.now


class Counting:
    """A handler that is an object: it counts its runs and signals the end of each."""

    def __init__(self) -> None:
        self.runs = 0
        self.ended = threading.Event()

    def __call__(self, container: Container) -> None:
        self.runs += 1
        self.ended.set()


class Blocked:
    """Stands in for a handler that runs long: it counts its runs and waits until it is released."""

    def __init__(self) -> None:
        self.started, self.released = threading.Event(), threading.Event()
        self.runs = 0

    def __call__(self, container: Container) -> None:
        self.runs += 1
        self.started.set()
        self.released.wait(WAIT_SECONDS)


def handler(name: str, run, seconds: int, starts_immediately: bool = False) -> TickHandler:
    return TickHandler(TickInterval(seconds=seconds), run, name, starts_immediately=starts_immediately)


def started_ticker(home, *handlers: TickHandler, wake=lambda: None, worker_count: int | None = None) -> tuple[Ticker, TickClock]:
    clock = TickClock()
    ticker = Ticker(home, handlers, wake, clock)
    if worker_count is None:
        ticker.start()
    else:
        ticker.start(worker_count)
    return ticker, clock


def tick_at(ticker: Ticker, clock: TickClock, seconds: float) -> None:
    clock.now = seconds
    ticker.tick()
    ticker.join(JOIN_SECONDS)


def test_a_handler_runs_once_its_interval_has_passed_and_then_again_each_interval(synced_home):
    counting = Counting()
    ticker, clock = started_ticker(synced_home, handler("counting", counting, 10))
    tick_at(ticker, clock, 9)
    assert counting.runs == 0
    tick_at(ticker, clock, 10)
    tick_at(ticker, clock, 15)
    assert counting.runs == 1
    tick_at(ticker, clock, 20)
    assert counting.runs == 2


def test_a_handler_that_runs_at_start_runs_on_the_first_tick(synced_home):
    counting = Counting()
    ticker, clock = started_ticker(synced_home, handler("counting", counting, 60, starts_immediately=True))
    tick_at(ticker, clock, 0)
    tick_at(ticker, clock, 30)
    assert counting.runs == 1
    tick_at(ticker, clock, 60)
    assert counting.runs == 2


def test_a_lambda_registered_on_the_ticker_runs_on_a_container_of_the_journal(synced_home):
    containers = []
    ticker, clock = started_ticker(synced_home)
    ticker.register(handler("lambda", containers.append, 1))
    tick_at(ticker, clock, 1)
    assert len(containers) == 1 and isinstance(containers[0], Container)


def test_a_class_with_a_call_keeps_what_it_holds_from_one_run_to_the_next(synced_home):
    counting = Counting()
    ticker, clock = started_ticker(synced_home, handler("counting", counting, 1))
    for second in (1, 2, 3):
        tick_at(ticker, clock, second)
    assert counting.runs == 3


def test_each_module_declares_the_handlers_it_needs_and_the_ticker_takes_them(synced_home):
    names = [declared.label for declared in Ticker.module_handlers(ModuleFinder(synced_home))]
    assert {"read running outputs", "agent minute steps", "hook pruning", "phone notices"} <= set(names)
    assert len(names) == len(set(names))


def test_the_handlers_the_modules_declare_start_at_their_own_pace(synced_home):
    intervals = {declared.label: (declared.interval.seconds, declared.starts_immediately) for declared in Ticker.module_handlers(ModuleFinder(synced_home))}
    assert intervals["read running outputs"] == (1, False)
    assert intervals["agent minute steps"] == (60, True)
    assert intervals["hook pruning"] == (60 * 60, False)
    assert intervals["phone notices"] == (60, True)


def test_a_handler_with_the_name_of_another_is_refused(synced_home):
    ticker, _ = started_ticker(synced_home, handler("counting", Counting(), 1))
    with pytest.raises(ValueError):
        ticker.register(handler("counting", Counting(), 2))


def test_a_slow_handler_runs_on_its_own_thread_and_holds_up_no_other_handler(synced_home):
    slow, quick = Blocked(), Counting()
    ticker, clock = started_ticker(synced_home, handler("slow", slow, 1), handler("quick", quick, 1))
    clock.now = 1
    ticker.tick()
    assert slow.started.wait(JOIN_SECONDS)
    clock.now = 2
    ticker.tick()
    slow.released.set()
    ticker.join(JOIN_SECONDS)
    assert quick.runs >= 1


def test_a_handler_still_running_is_not_started_again(synced_home):
    slow = Blocked()
    ticker, clock = started_ticker(synced_home, handler("slow", slow, 1))
    clock.now = 1
    ticker.tick()
    assert slow.started.wait(JOIN_SECONDS)
    for second in (2, 3, 4):
        clock.now = second
        ticker.tick()
    slow.released.set()
    ticker.join(JOIN_SECONDS)
    assert slow.runs == 1


def test_a_handler_that_fails_is_logged_and_the_others_still_run(synced_home):
    after = Counting()

    def broken(container: Container) -> None:
        raise ValueError("the copy broke")

    ticker, clock = started_ticker(synced_home, handler("broken", broken, 1), handler("after", after, 1))
    tick_at(ticker, clock, 1)
    assert after.runs == 1
    log = synced_home.system_log.read_text()
    assert "ValueError: the copy broke" in log and "journal broken" in log
    tick_at(ticker, clock, 2)
    assert after.runs == 2


def test_each_handler_run_hands_its_written_events_to_the_wake_whatever_it_answers(synced_home):
    wake_calls = []
    ticker, clock = started_ticker(synced_home, handler("idle", lambda container: False, 1), wake=lambda: wake_calls.append(True))
    tick_at(ticker, clock, 1)
    assert wake_calls == [True]


def test_a_forty_second_process_pruning_holds_one_worker(synced_home):
    pruning, output_reader, agent_checks = Blocked(), Counting(), Counting()
    ticker, clock = started_ticker(synced_home, handler("process pruning", pruning, PRUNING_SECONDS), handler("output reading", output_reader, OUTPUT_READER_SECONDS),
                                   handler("agent checks", agent_checks, OUTPUT_READER_SECONDS))
    clock.now = PRUNING_SECONDS
    ticker.tick()
    assert pruning.started.wait(WAIT_SECONDS) and output_reader.ended.wait(WAIT_SECONDS) and agent_checks.ended.wait(WAIT_SECONDS)
    for _ in range(3):
        output_reader.ended.clear()
        clock.now += OUTPUT_READER_SECONDS
        ticker.tick()
        assert output_reader.ended.wait(WAIT_SECONDS)
    pruning.released.set()
    ticker.stop(WAIT_SECONDS)
    assert (pruning.runs, output_reader.runs) == (1, 4)


def test_output_reading_is_not_queued_again_while_it_runs(synced_home):
    output_reader = Blocked()
    ticker, clock = started_ticker(synced_home, handler("output reading", output_reader, OUTPUT_READER_SECONDS))
    clock.now = OUTPUT_READER_SECONDS
    ticker.tick()
    assert output_reader.started.wait(WAIT_SECONDS)
    for _ in range(5):
        clock.now += OUTPUT_READER_SECONDS
        ticker.tick()
    output_reader.released.set()
    ticker.join(WAIT_SECONDS)
    ticker.stop(WAIT_SECONDS)
    assert output_reader.runs == 1


def test_the_ticker_names_a_handler_that_waited_longer_than_its_interval(synced_home):
    pruning, output_reader = Blocked(), Counting()
    ticker, clock = started_ticker(synced_home, handler("process pruning", pruning, PRUNING_SECONDS), handler("output reading", output_reader, OUTPUT_READER_SECONDS), worker_count=1)
    clock.now = PRUNING_SECONDS
    ticker.tick()
    assert pruning.started.wait(WAIT_SECONDS)
    clock.now += 5
    pruning.released.set()
    assert output_reader.ended.wait(WAIT_SECONDS)
    ticker.join(WAIT_SECONDS)
    ticker.stop(WAIT_SECONDS)
    lines = [line for line in synced_home.system_log.read_text().splitlines() if "the ticker could not keep up" in line]
    assert len(lines) == 1 and "output reading waited 5 s for a worker (interval 1 s)" in lines[0], lines


def test_the_tick_worker_count_is_three_by_default(synced_home):
    container = synced_container(synced_home)
    worker_count = Ticker.worker_count(container)
    container.get(Database).close()
    assert worker_count == TIMED_JOB_COUNT == 3


def test_the_tick_worker_count_follows_its_setting(journal):
    assert journal.run(f"setting set {TIMED_JOBS_KEY} 5 --project").code == 0
    worker_count = Ticker.worker_count(journal.container)
    ticker, _ = started_ticker(journal.home, worker_count=worker_count)
    started_count = len(ticker.workers)
    ticker.stop(WAIT_SECONDS)
    assert (worker_count, started_count) == (5, 5)


def test_starts_immediately_handlers_run_on_the_first_tick(synced_home):
    handlers = Ticker.module_handlers(ModuleFinder(synced_home))
    ticker = Ticker(synced_home, handlers, lambda: None, TickClock())
    ticker.start()
    ticker.tick()
    ticker.join(WAIT_SECONDS)
    ticker.stop(WAIT_SECONDS)
    immediate = sorted(declared.label for declared in handlers if declared.starts_immediately)
    assert immediate and sorted(ticker.due.started_seconds) == immediate
