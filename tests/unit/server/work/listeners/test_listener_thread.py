import threading

from server.work.listeners.listener_thread import ListenerThread

TIMEOUT_SECONDS = 10


def test_a_wake_runs_a_round_and_an_error_in_a_round_is_reported_and_the_next_round_runs():
    rounds: list[str] = []
    errors: list[Exception] = []
    first_error, second_round = threading.Event(), threading.Event()

    def round_runner() -> None:
        rounds.append("round")
        if len(rounds) == 1:
            raise RuntimeError("the first round fails")
        second_round.set()

    def error_reporter(error: Exception) -> None:
        errors.append(error)
        first_error.set()

    thread = ListenerThread(round_runner, error_reporter, period_seconds=TIMEOUT_SECONDS)
    thread.start()
    thread.wake()
    assert first_error.wait(TIMEOUT_SECONDS)
    thread.wake()
    assert second_round.wait(TIMEOUT_SECONDS)
    thread.stop()
    assert [str(error) for error in errors] == ["the first round fails"] and len(rounds) == 2


def test_a_wake_reaches_every_linked_thread():
    rounds = threading.Barrier(3)

    def round_runner() -> None:
        rounds.wait(TIMEOUT_SECONDS)

    def error_reporter(error: Exception) -> None:
        raise error

    linked = [ListenerThread(round_runner, error_reporter, period_seconds=TIMEOUT_SECONDS) for _ in range(2)]
    thread = ListenerThread(lambda: None, error_reporter, period_seconds=TIMEOUT_SECONDS, linked_threads=linked)
    for started in linked:
        started.start()
    thread.wake()
    rounds.wait(TIMEOUT_SECONDS)
    for started in linked:
        started.stop()


def test_the_thread_runs_a_round_once_a_period_without_a_wake():
    round_event = threading.Event()
    thread = ListenerThread(round_event.set, lambda error: None, period_seconds=0.05)
    thread.start()
    assert round_event.wait(TIMEOUT_SECONDS)
    thread.stop()


def test_a_stop_while_a_round_runs_returns_within_the_stop_limit_and_starts_no_further_round():
    running, release = threading.Event(), threading.Event()
    rounds: list[str] = []

    def round_runner() -> None:
        rounds.append("round")
        running.set()
        release.wait(TIMEOUT_SECONDS * 3)

    thread = ListenerThread(round_runner, lambda error: None, period_seconds=TIMEOUT_SECONDS)
    thread.start()
    thread.wake()
    assert running.wait(TIMEOUT_SECONDS)
    thread.stop()
    release.set()
    thread.wake()
    assert rounds == ["round"]


def test_listener_thread_calls_stop_callback_when_it_stops():
    ended = threading.Event()
    thread = ListenerThread(lambda: None, lambda error: None, period_seconds=TIMEOUT_SECONDS, stop_callback=ended.set)
    thread.start()
    thread.wake()
    thread.stop()
    assert ended.wait(TIMEOUT_SECONDS)
