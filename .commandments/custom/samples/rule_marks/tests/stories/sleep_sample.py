import time
from datetime import timedelta


def test_a_real_wait(story):
    # @sin architecture_testing_sleep_in_a_test
    time.sleep(1)


def test_a_clock_moved_forward(story):
    # @righteous architecture_testing_sleep_in_a_test
    story.advance(timedelta(seconds=1))
