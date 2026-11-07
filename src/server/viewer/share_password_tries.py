import time

TRY_COUNT = 5
WINDOW_SECONDS = 15 * 60


class SharePasswordTries:
    """Wrong passwords sent to a link, counted per link, since a tunnel gives every visitor the same address,
    so a link's password cannot be guessed without limit."""

    def __init__(self) -> None:
        self.wrong_times: dict[str, list[float]] = {}

    def is_blocked(self, token: str) -> bool:
        return len(self.recent(token)) >= TRY_COUNT

    def count(self, token: str) -> None:
        self.wrong_times[token] = [*self.recent(token), time.monotonic()]

    def recent(self, token: str) -> list[float]:
        return [event for event in self.wrong_times.get(token, []) if time.monotonic() - event < WINDOW_SECONDS]
