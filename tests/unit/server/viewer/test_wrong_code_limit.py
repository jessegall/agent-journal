from server.viewer.wrong_code_limit import WINDOW_SECONDS, WRONG_CODES_ALLOWED, WrongCodeLimit


class SetClock:
    def __init__(self) -> None:
        self.now = 0.0

    def __call__(self) -> float:
        return self.now


def test_codes_stop_being_taken_after_too_many_wrong_ones_and_start_again_after_a_minute():
    clock = SetClock()
    limit = WrongCodeLimit(clock)
    for _ in range(WRONG_CODES_ALLOWED):
        assert limit.allows()
        limit.counted()
    assert not limit.allows()
    clock.now = WINDOW_SECONDS + 1
    assert limit.allows()
