import threading


class TurnDepth(threading.local):
    """How many times the current thread holds the write turn inside itself, and how many statements it wrote
    in the turn it holds."""

    count = 0
    statements = 0
