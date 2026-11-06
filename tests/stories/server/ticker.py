import threading

import pytest

from core.base.container import Container
from core.base.module.module_finder import ModuleFinder
from core.base.ticker.tick_handler import TickHandler
from core.base.ticker.tick_interval import TickInterval
from server.ticker import Ticker
from tests.stories.core.support.fixtures import UserJoined
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_answers, expect_system_log_with, expect_value, expect_wait_arrived

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
    expect_row(counting, runs=0)
    tick_at(ticker, clock, 10)
    tick_at(ticker, clock, 15)
    expect_row(counting, runs=1)
    tick_at(ticker, clock, 20)
    expect_row(counting, runs=2)


def test_a_handler_that_runs_at_start_runs_on_the_first_tick(new_story):
    story = new_story(fixture=UserJoined)
    counting = Counting()
    ticker, clock = ticker_of(story, TickHandler(TickInterval(seconds=60), counting, "counting", starts_immediately=True))
    tick_at(ticker, clock, 0)
    tick_at(ticker, clock, 30)
    expect_row(counting, runs=1)
    tick_at(ticker, clock, 60)
    expect_row(counting, runs=2)


def test_a_lambda_registered_on_the_ticker_runs_on_a_fresh_container_of_the_journal(new_story):
    story = new_story(fixture=UserJoined)
    containers = []
    ticker, clock = ticker_of(story)
    ticker.register(TickHandler(TickInterval(seconds=1), lambda container: containers.append(container), "lambda"))
    tick_at(ticker, clock, 1)
    expect_answers(containers, 1)
    expect_isinstance_2(containers)
    expect_changed_containers(containers, story.container)


def test_a_class_with_a_call_keeps_what_it_holds_from_one_run_to_the_next(new_story):
    story = new_story(fixture=UserJoined)
    counting = Counting()
    ticker, clock = ticker_of(story, TickHandler(TickInterval(seconds=1), counting, "counting"))
    for second in (1, 2, 3):
        tick_at(ticker, clock, second)
    expect_row(counting, runs=3)


def test_each_module_declares_the_handlers_it_needs_and_the_ticker_takes_them(new_story):
    story = new_story(fixture=UserJoined)
    declared = Ticker.module_handlers(ModuleFinder(story.home))
    names = [handler.label for handler in declared]
    expect_value_limit_2("read running outputs", "agent ticks", "hook pruning", "phone notices", set(names))
    expect_answers(names, len(set(names)))


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
    expect_wait_arrived(started, JOIN_SECONDS)
    clock.now = 2
    ticker.tick()
    release.set()
    ticker.join(JOIN_SECONDS)
    expect_runs_quick_minimum(quick, 1)


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
    expect_wait_arrived(started, JOIN_SECONDS)
    for second in (2, 3, 4):
        clock.now = second
        ticker.tick()
    release.set()
    ticker.join(JOIN_SECONDS)
    expect_value(runs, [1])


def test_a_handler_that_fails_is_logged_and_the_others_still_run(new_story):
    story = new_story(fixture=UserJoined)
    after = Counting()

    def broken(container: Container) -> None:
        raise ValueError("the copy broke")

    ticker, clock = ticker_of(story, TickHandler(TickInterval(seconds=1), broken, "broken"), TickHandler(TickInterval(seconds=1), after, "after"))
    tick_at(ticker, clock, 1)
    expect_runs_after(after, 1)
    expect_system_log_with(story, "ValueError: the copy broke")
    expect_system_log_with(story, "journal broken")
    tick_at(ticker, clock, 2)
    expect_row(after, runs=2)


def test_a_handler_that_answers_true_wakes_the_listeners_and_one_that_does_not_leaves_them(new_story):
    story = new_story(fixture=UserJoined)
    wake_calls = []
    ticker, clock = ticker_of(story, TickHandler(TickInterval(seconds=1), lambda container: False, "idle"), wake=lambda: wake_calls.append(True))
    tick_at(ticker, clock, 1)
    expect_value(wake_calls, [])
    ticker.register(TickHandler(TickInterval(seconds=1), lambda container: True, "wrote"))
    tick_at(ticker, clock, 2)
    expect_value(wake_calls, [True])


def expect_runs_after(after, expected) -> None:
    actual = after.runs
    assert actual == expected, actual


def expect_runs_quick_minimum(quick, expected) -> None:
    actual = quick.runs
    assert actual >= expected, actual


def expect_value_limit_2(text, text_2, text_3, text_4, expected) -> None:
    actual = {text, text_2, text_3, text_4}
    assert actual <= expected, actual


def expect_isinstance_2(containers) -> None:
    actual = isinstance(containers[0], Container)
    assert actual, actual


def expect_changed_containers(containers, expected) -> None:
    actual = containers[0]
    assert actual is not expected, actual
