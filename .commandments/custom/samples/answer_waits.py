import time

START_SECONDS = 20


def answered(check) -> bool:
    # @sin LongAnswerWaitDetector
    deadline = time.monotonic() + 30
    while time.monotonic() < deadline and not check():
        time.sleep(0.05)
    return check()


def reached(check) -> bool:
    # @righteous LongAnswerWaitDetector
    deadline = time.monotonic() + 3
    while time.monotonic() < deadline and not check():
        time.sleep(0.05)
    return check()


def started(check) -> bool:
    # @righteous LongAnswerWaitDetector
    deadline = time.monotonic() + START_SECONDS
    while time.monotonic() < deadline and not check():
        time.sleep(0.5)
    return check()
