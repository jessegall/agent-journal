import time
from datetime import timedelta


def test_a_real_wait(story):
    # @sin architecture_testing_NoSleepInTestsDetector
    time.sleep(1)


def test_a_clock_moved_forward(story):
    # @righteous architecture_testing_NoSleepInTestsDetector
    story.advance(timedelta(seconds=1))
