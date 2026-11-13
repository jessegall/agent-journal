import threading


class TurnDepth(threading.local):
    """How many times the current thread holds the write turn inside itself."""

    count = 0
