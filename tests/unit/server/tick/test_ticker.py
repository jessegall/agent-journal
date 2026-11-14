import threading

from engine.container.container import Container
from engine.journal.journal_home import JournalHome
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from server.tick.ticker import Ticker
from server.tick.queued_tick_handler import QueuedTickHandler
from server.work.round_container import RoundContainer

TIMEOUT_SECONDS = 10.0
INTERVAL_SECONDS = 60


class SampleRoundContainer(RoundContainer):
    def __init__(self, home: JournalHome) -> None:
        self.container = Container()
        self.is_closed = False

    def round_container(self) -> Container:
        return self.container

    def ended_round(self, work_name: str) -> None:
        pass

    def failed(self, error: BaseException, work_name: str) -> None:
        pass

    def close(self) -> None:
        self.is_closed = True


class SampleClock:
    def __init__(self) -> None:
        self.now = 0.0

    def __call__(self) -> float:
        return self.now


class SampleHandlerError(Exception):
    def __init__(self) -> None:
        super().__init__("the handler failed")


class BlockedHandler:
    def __init__(self) -> None:
        self.started, self.released = threading.Event(), threading.Event()

    def __call__(self, container: Container) -> None:
        self.started.set()
        self.released.wait(TIMEOUT_SECONDS)


def handler(name: str, run, starts_immediately: bool = False) -> TickHandler:
    return TickHandler(TickInterval(seconds=INTERVAL_SECONDS), run, name, starts_immediately)


def ticker(tmp_path, handlers: list[TickHandler], clock: SampleClock) -> Ticker:
    return Ticker(JournalHome(tmp_path), handlers, lambda: None, clock, containers=SampleRoundContainer)


def test_due_handlers_are_queued_not_started_on_new_threads(tmp_path):
    clock = SampleClock()
    ticks = ticker(tmp_path, [handler("checks", lambda container: None)], clock)
    thread_count = threading.active_count()
    clock.now = INTERVAL_SECONDS
    ticks.tick()
    assert (ticks.waiting_handlers.qsize(), ticks.busy_labels(), threading.active_count()) == (1, {"checks"}, thread_count)


def test_a_queued_handler_is_not_queued_twice(tmp_path):
    clock = SampleClock()
    ticks = ticker(tmp_path, [handler("checks", lambda container: None)], clock)
    for seconds in (INTERVAL_SECONDS, 2 * INTERVAL_SECONDS):
        clock.now = seconds
        ticks.tick()
    assert ticks.waiting_handlers.qsize() == 1


def test_a_running_handler_is_not_queued_twice(tmp_path):
    clock, blocked = SampleClock(), BlockedHandler()
    ticks = ticker(tmp_path, [handler("slow", blocked)], clock)
    ticks.start()
    clock.now = INTERVAL_SECONDS
    ticks.tick()
    assert blocked.started.wait(TIMEOUT_SECONDS)
    clock.now = 2 * INTERVAL_SECONDS
    ticks.tick()
    assert (ticks.waiting_handlers.qsize(), ticks.busy_labels()) == (0, {"slow"})
    blocked.released.set()
    ticks.join(TIMEOUT_SECONDS)
    ticks.stop(TIMEOUT_SECONDS)


def test_a_slow_handler_occupies_one_worker_the_others_keep_running(tmp_path):
    clock, blocked = SampleClock(), BlockedHandler()
    handler_runs = [threading.Event(), threading.Event()]
    handlers = [handler("slow", blocked), handler("first", lambda container: handler_runs[0].set()), handler("second", lambda container: handler_runs[1].set())]
    ticks = ticker(tmp_path, handlers, clock)
    ticks.start(3)
    clock.now = INTERVAL_SECONDS
    ticks.tick()
    assert blocked.started.wait(TIMEOUT_SECONDS) and all(event.wait(TIMEOUT_SECONDS) for event in handler_runs)
    assert ticks.busy_labels() == {"slow"}
    blocked.released.set()
    ticks.stop(TIMEOUT_SECONDS)


def test_starts_immediately_handler_run_on_the_first_tick(tmp_path):
    clock, handler_run = SampleClock(), threading.Event()
    ticks = ticker(tmp_path, [handler("tunnel", lambda container: handler_run.set(), starts_immediately=True), handler("checks", lambda container: None)], clock)
    ticks.start()
    ticks.tick()
    assert handler_run.wait(TIMEOUT_SECONDS)
    ticks.join(TIMEOUT_SECONDS)
    assert ticks.due.started_seconds == {"tunnel": 0.0}
    ticks.stop(TIMEOUT_SECONDS)


def test_a_handler_error_is_reported_and_the_worker_goes_on(tmp_path):
    clock, handler_run = SampleClock(), threading.Event()

    def failing(container: Container) -> None:
        raise SampleHandlerError()

    ticks = ticker(tmp_path, [handler("failing", failing), handler("next", lambda container: handler_run.set())], clock)
    ticks.start(1)
    clock.now = INTERVAL_SECONDS
    ticks.tick()
    assert handler_run.wait(TIMEOUT_SECONDS)
    ticks.join(TIMEOUT_SECONDS)
    assert "the handler failed" in JournalHome(tmp_path).system_log.read_text()
    ticks.stop(TIMEOUT_SECONDS)


def test_stop_ends_every_worker(tmp_path):
    ticks = ticker(tmp_path, [], SampleClock())
    ticks.start()
    ticks.stop(TIMEOUT_SECONDS)
    assert not any(worker.thread.is_alive() for worker in ticks.workers)
    assert all(worker.containers.is_closed for worker in ticks.workers)


def late_lines(tmp_path) -> list[str]:
    log = JournalHome(tmp_path).system_log
    return [line for line in log.read_text().splitlines() if "the ticker could not keep up" in line] if log.exists() else []


def test_a_handler_that_waits_longer_than_its_interval_is_named_in_one_log_line(tmp_path):
    clock = SampleClock()
    ticks = ticker(tmp_path, [], clock)
    clock.now = INTERVAL_SECONDS + 1
    ticks.log_late_start(QueuedTickHandler(handler("output reading", lambda container: None), 0.0))
    lines = late_lines(tmp_path)
    assert len(lines) == 1 and "output reading waited 61 s for a worker (interval 60 s)" in lines[0]


def test_a_handler_that_waits_less_is_not_named(tmp_path):
    clock = SampleClock()
    ticks = ticker(tmp_path, [], clock)
    clock.now = INTERVAL_SECONDS - 1
    ticks.log_late_start(QueuedTickHandler(handler("output reading", lambda container: None), 0.0))
    assert late_lines(tmp_path) == []


def test_the_line_repeats_at_most_once_per_five_minutes(tmp_path):
    clock = SampleClock()
    ticks = ticker(tmp_path, [], clock)
    late = handler("output reading", lambda container: None)
    for queued_seconds in (0.0, 100.0, 200.0, 400.0):
        clock.now = queued_seconds + 2 * INTERVAL_SECONDS
        ticks.log_late_start(QueuedTickHandler(late, queued_seconds))
    assert len(late_lines(tmp_path)) == 2


def test_worker_count_follows_the_setting(tmp_path):
    ticks = ticker(tmp_path, [], SampleClock())
    ticks.start(5)
    assert sum(1 for worker in ticks.workers if worker.thread.is_alive()) == 5
    ticks.stop(TIMEOUT_SECONDS)
