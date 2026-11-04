import time


def is_ready() -> bool:
    return True


def clocked_wait() -> None:
    deadline = time.monotonic() + 5
    # @sin architecture_testing_clock_loop_in_a_test
    while not is_ready() and time.monotonic() < deadline:
        continue


def plain_wait() -> None:
    # @righteous architecture_testing_clock_loop_in_a_test
    while not is_ready():
        break
