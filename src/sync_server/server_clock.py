import time


class ServerClock:
    """The team server's time, which every answer carries and every pushed time is put on."""

    def time(self) -> float:
        return time.time()

    def monotonic(self) -> float:
        return time.monotonic()
