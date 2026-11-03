import threading

import pytest

from core.base.container import Container
from core.base.module.module_finder import ModuleFinder
from core.base.ticker.tick_handler import TickHandler
from core.base.ticker.tick_interval import TickInterval
from server.ticker import Ticker
from tests.stories.core.support.fixtures import UserJoined

JOIN_SECONDS = 5.0


class Clock:
    def __init__(self) -> None:
        self.now = 0.0

    def __call__(self) -> float:
        return self.now


class Counting:
    """A handler that is an object: it keeps its count between runs."""

    def __init__(self) -> None:
        self.runs = 0

    def __call__(self, container: Container) -> None:
        self.runs += 1


def ticker_of(story, *handlers: TickHandler, wake=lambda: None) -> tuple[Ticker, Clock]:
    clock = Clock()
    return Ticker(story.home, handlers, wake, clock), clock


def tick_at(ticker: Ticker, clock: Clock, seconds: float) -> None:
    clock.now = seconds
    ticker.tick()
    ticker.join(JOIN_SECONDS)


def test_a_handler_runs_once_its_interval_has_passed_and_then_again_each_interval(new_story):
    story = new_story(fixture=UserJoined)
    counting = Counting()
    ticker, clock = ticker_of(story, TickHandler(TickInterval(seconds=10), counting, "counting"))
    tick_at(ticker, clock, 9)
    assert counting.runs == 0
    tick_at(ticker, clock, 10)
    tick_at(ticker, clock, 15)
    assert counting.runs == 1
    tick_at(ticker, clock, 20)
    assert counting.runs == 2


def test_a_handler_that_runs_at_start_runs_on_the_first_tick(new_story):
    story = new_story(fixture=UserJoined)
    counting = Counting()
    ticker, clock = ticker_of(story, TickHandler(TickInterval(seconds=60), counting, "counting", at_start=True))
    tick_at(ticker, clock, 0)
    tick_at(ticker, clock, 30)
    assert counting.runs == 1
    tick_at(ticker, clock, 60)
    assert counting.runs == 2


def test_a_lambda_registered_on_the_ticker_runs_on_a_fresh_container_of_the_journal(new_story):
    story = new_story(fixture=UserJoined)
    seen = []
    ticker, clock = ticker_of(story)
    ticker.register(TickHandler(TickInterval(seconds=1), lambda container: seen.append(container), "lambda"))
    tick_at(ticker, clock, 1)
    assert len(seen) == 1 and isinstance(seen[0], Container) and seen[0] is not story.container


def test_a_class_with_a_call_keeps_what_it_holds_from_one_run_to_the_next(new_story):
    story = new_story(fixture=UserJoined)
    counting = Counting()
    ticker, clock = ticker_of(story, TickHandler(TickInterval(seconds=1), counting, "counting"))
    for second in (1, 2, 3):
        tick_at(ticker, clock, second)
    assert counting.runs == 3


def test_each_module_declares_the_handlers_it_needs_and_the_ticker_takes_them(new_story):
    story = new_story(fixture=UserJoined)
    declared = Ticker.declared_by(ModuleFinder(story.home))
    names = [handler.label for handler in declared]
    assert {"read running outputs", "agent ticks", "hook pruning", "phone notices"} <= set(names)
    assert len(names) == len(set(names))


def test_a_handler_with_the_name_of_another_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    ticker, _ = ticker_of(story, TickHandler(TickInterval(seconds=1), Counting(), "counting"))
    with pytest.raises(ValueError):
        ticker.register(TickHandler(TickInterval(seconds=2), Counting(), "counting"))


def test_a_slow_handler_runs_on_its_own_thread_and_holds_up_no_other_handler(new_story):
    story = new_story(fixture=UserJoined)
    release, started = threading.Event(), threading.Event()
    quick = Counting()

    def slow(container: Container) -> None:
        started.set()
        release.wait(JOIN_SECONDS)

    ticker, clock = ticker_of(story, TickHandler(TickInterval(seconds=1), slow, "slow"), TickHandler(TickInterval(seconds=1), quick, "quick"))
    clock.now = 1
    ticker.tick()
    assert started.wait(JOIN_SECONDS)
    clock.now = 2
    ticker.tick()
    release.set()
    ticker.join(JOIN_SECONDS)
    assert quick.runs >= 1


def test_a_handler_still_running_is_not_started_again(new_story):
    story = new_story(fixture=UserJoined)
    release, started, runs = threading.Event(), threading.Event(), []

    def slow(container: Container) -> None:
        runs.append(1)
        started.set()
        release.wait(JOIN_SECONDS)

    ticker, clock = ticker_of(story, TickHandler(TickInterval(seconds=1), slow, "slow"))
    clock.now = 1
    ticker.tick()
    assert started.wait(JOIN_SECONDS)
    for second in (2, 3, 4):
        clock.now = second
        ticker.tick()
    release.set()
    ticker.join(JOIN_SECONDS)
    assert runs == [1]


def test_a_handler_that_fails_is_logged_and_the_others_still_run(new_story):
    story = new_story(fixture=UserJoined)
    after = Counting()

    def broken(container: Container) -> None:
        raise ValueError("the copy broke")

    ticker, clock = ticker_of(story, TickHandler(TickInterval(seconds=1), broken, "broken"), TickHandler(TickInterval(seconds=1), after, "after"))
    tick_at(ticker, clock, 1)
    assert after.runs == 1 and "ValueError: the copy broke" in story.error_log_text() and "journal broken" in story.error_log_text()
    tick_at(ticker, clock, 2)
    assert after.runs == 2


def test_a_handler_that_answers_true_wakes_the_listeners_and_one_that_does_not_leaves_them(new_story):
    story = new_story(fixture=UserJoined)
    woken = []
    ticker, clock = ticker_of(story, TickHandler(TickInterval(seconds=1), lambda container: False, "idle"), wake=lambda: woken.append(True))
    tick_at(ticker, clock, 1)
    assert woken == []
    ticker.register(TickHandler(TickInterval(seconds=1), lambda container: True, "wrote"))
    tick_at(ticker, clock, 2)
    assert woken == [True]
