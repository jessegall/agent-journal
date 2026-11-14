import time


def wait_for_file(path):
    deadline = time.monotonic() + 5
    # @sin architecture_core_poll_with_deadline
    while time.monotonic() < deadline:
        if path.exists():
            return True
        time.sleep(0.1)
    return False


def wait_until_gone(path):
    deadline = time.monotonic() + 5
    # @sin architecture_core_poll_with_deadline
    while path.exists():
        if time.monotonic() >= deadline:
            return False
        time.sleep(0.1)
    return True


def drain(lines):
    # @righteous architecture_core_poll_with_deadline
    while lines:
        lines.pop()
    # @righteous architecture_core_poll_with_deadline
    while lines:
        time.sleep(0.1)
