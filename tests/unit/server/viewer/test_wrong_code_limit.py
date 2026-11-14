from concurrent.futures import ThreadPoolExecutor

from server.viewer.wrong_code_limit import CODES_ALLOWED, WINDOW_SECONDS, WrongCodeLimit

PARALLEL_CODES = 20


class SetClock:
    def __init__(self) -> None:
        self.now = 0.0

    def __call__(self) -> float:
        return self.now


def test_codes_stop_being_taken_after_five_in_a_minute_and_start_again_after_it():
    clock = SetClock()
    limit = WrongCodeLimit(clock)
    assert [limit.admits() for _ in range(CODES_ALLOWED + 1)] == [True] * CODES_ALLOWED + [False]
    clock.now = WINDOW_SECONDS + 1
    assert limit.admits()


def test_codes_sent_at_the_same_moment_still_take_only_five():
    limit = WrongCodeLimit(SetClock())
    with ThreadPoolExecutor(PARALLEL_CODES) as pool:
        admitted = list(pool.map(lambda _: limit.admits(), range(PARALLEL_CODES)))
    assert admitted.count(True) == CODES_ALLOWED
