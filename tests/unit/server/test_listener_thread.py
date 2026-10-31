import threading

from server.listener_thread import ListenerThread

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


def test_the_thread_runs_a_round_once_a_period_without_a_wake():
    round_event = threading.Event()
    thread = ListenerThread(round_event.set, lambda error: None, period_seconds=0.05)
    thread.start()
    assert round_event.wait(TIMEOUT_SECONDS)
    thread.stop()
