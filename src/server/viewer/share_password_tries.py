import time

TRY_COUNT = 5
WINDOW_SECONDS = 15 * 60


class SharePasswordTries:
    """Wrong passwords sent to links, counted per address they come from, so a link's password cannot be guessed without limit."""

    def __init__(self) -> None:
        self.wrong_times: dict[str, list[float]] = {}

    def is_locked_out(self, address: str) -> bool:
        return len(self.recent(address)) >= TRY_COUNT

    def count(self, address: str) -> None:
        self.wrong_times[address] = [*self.recent(address), time.monotonic()]

    def recent(self, address: str) -> list[float]:
        return [moment for moment in self.wrong_times.get(address, []) if time.monotonic() - moment < WINDOW_SECONDS]
