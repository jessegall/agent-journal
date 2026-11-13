import threading

from engine.container.container import Container
from engine.database.database import Database
from engine.module.journal_container import synced_container
from engine.module.module_finder import ModuleFinder
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from server.tick.ticker import TICK_WORKER_COUNT, Ticker
from tests.stories.core.support.fixtures import UserJoined

WAIT_SECONDS = 30.0
PRUNING_SECONDS = 600
OUTPUT_READER_SECONDS = 1
TICK_WORKERS_KEY = "journal.core.processes.tick-workers"


class TickClock:
    def __init__(self) -> None:
        self.now = 0.0

    def __call__(self) -> float:
        return self.now


class BlockedHandler:
    """Stands in for a handler that runs long: it counts its runs and waits until it is released."""

    def __init__(self) -> None:
        self.started, self.released = threading.Event(), threading.Event()
        self.run_count = 0

    def __call__(self, container: Container) -> None:
        self.run_count += 1
        self.started.set()
        self.released.wait(WAIT_SECONDS)


class CountedHandler:
    def __init__(self) -> None:
        self.run_count = 0
        self.ended = threading.Event()

    def __call__(self, container: Container) -> None:
        self.run_count += 1
        self.ended.set()


def tick_handler(name: str, handler, seconds: int) -> TickHandler:
    return TickHandler(TickInterval(seconds=seconds), handler, name)


def test_a_forty_second_process_pruning_holds_one_worker(new_story):
    story = new_story(fixture=UserJoined)
    clock, pruning, output_reader, agent_checks = TickClock(), BlockedHandler(), CountedHandler(), CountedHandler()
    handlers = [tick_handler("process pruning", pruning, PRUNING_SECONDS), tick_handler("output reading", output_reader, OUTPUT_READER_SECONDS),
                tick_handler("agent checks", agent_checks, OUTPUT_READER_SECONDS)]
    ticker = Ticker(story.home, handlers, lambda: None, clock)
    ticker.start()
    clock.now = PRUNING_SECONDS
    ticker.tick()
    story.expect_rows(pruning.started.wait(WAIT_SECONDS), output_reader.ended.wait(WAIT_SECONDS), agent_checks.ended.wait(WAIT_SECONDS))
    for _ in range(3):
        output_reader.ended.clear()
        clock.now += OUTPUT_READER_SECONDS
        ticker.tick()
        story.expect_rows(output_reader.ended.wait(WAIT_SECONDS))
    pruning.released.set()
    ticker.stop(WAIT_SECONDS)
    story.expected(pruning.run_count == 1 and output_reader.run_count == 4, f"pruning ran {pruning.run_count}, output reading {output_reader.run_count} times")


def test_output_reading_is_not_queued_again_while_it_runs(new_story):
    story = new_story(fixture=UserJoined)
    clock, output_reader = TickClock(), BlockedHandler()
    ticker = Ticker(story.home, [tick_handler("output reading", output_reader, OUTPUT_READER_SECONDS)], lambda: None, clock)
    ticker.start()
    clock.now = OUTPUT_READER_SECONDS
    ticker.tick()
    story.expect_rows(output_reader.started.wait(WAIT_SECONDS))
    for _ in range(5):
        clock.now += OUTPUT_READER_SECONDS
        ticker.tick()
    output_reader.released.set()
    ticker.join(WAIT_SECONDS)
    ticker.stop(WAIT_SECONDS)
    story.expected(output_reader.run_count == 1, f"output reading ran {output_reader.run_count} times")


def test_the_ticker_names_a_handler_that_waited_longer_than_its_interval(new_story):
    story = new_story(fixture=UserJoined)
    clock, pruning, output_reader = TickClock(), BlockedHandler(), CountedHandler()
    ticker = Ticker(story.home, [tick_handler("process pruning", pruning, PRUNING_SECONDS), tick_handler("output reading", output_reader, OUTPUT_READER_SECONDS)], lambda: None, clock)
    ticker.start(1)
    clock.now = PRUNING_SECONDS
    ticker.tick()
    story.expect_rows(pruning.started.wait(WAIT_SECONDS))
    clock.now += 5
    pruning.released.set()
    story.expect_rows(output_reader.ended.wait(WAIT_SECONDS))
    ticker.join(WAIT_SECONDS)
    ticker.stop(WAIT_SECONDS)
    lines = [line for line in story.home.system_log.read_text().splitlines() if "the ticker could not keep up" in line]
    story.expected(len(lines) == 1 and "output reading waited 5 s for a worker (interval 1 s)" in lines[0], f"log lines {lines}")


def test_the_tick_worker_count_is_three_by_default(new_story):
    story = new_story(fixture=UserJoined)
    container = synced_container(story.home)
    worker_count = Ticker.worker_count(container)
    container.get(Database).close()
    story.expected(worker_count == TICK_WORKER_COUNT == 3, f"the default is {worker_count} workers")


def test_the_tick_worker_count_follows_its_setting(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting make {TICK_WORKERS_KEY} 5")
    container = synced_container(story.home)
    worker_count = Ticker.worker_count(container)
    container.get(Database).close()
    ticker = Ticker(story.home, [], lambda: None, TickClock())
    ticker.start(worker_count)
    started_count = len(ticker.workers)
    ticker.stop(WAIT_SECONDS)
    story.expected((worker_count, started_count) == (5, 5), f"{worker_count} workers read, {started_count} started")


def test_starts_immediately_handlers_run_on_the_first_tick(new_story):
    story = new_story(fixture=UserJoined)
    handlers = Ticker.module_handlers(ModuleFinder(story.home))
    ticker = Ticker(story.home, handlers, lambda: None, TickClock())
    ticker.start()
    ticker.tick()
    ticker.join(WAIT_SECONDS)
    ticker.stop(WAIT_SECONDS)
    immediate = sorted(handler.label for handler in handlers if handler.starts_immediately)
    story.expected(bool(immediate) and sorted(ticker.due.started_seconds) == immediate, f"started {sorted(ticker.due.started_seconds)}, immediate {immediate}")
