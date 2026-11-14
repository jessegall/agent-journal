import time
from collections.abc import Callable

from engine.container.container import Container
from core.modules.library.support.round_memory import RoundMemory
from core.modules.library.ticks.library_sync import LibrarySync

INTERVAL_SECONDS = 10
LONGEST_WAIT_SECONDS = 300


class LibrarySyncTick:
    """A sync round every tick while the server answers; after a failed round it waits twice as long each time,
    up to five minutes, so a laptop without a network does not keep trying. It keeps the last list and the
    versions that could not be read."""

    def __init__(self, seconds: Callable[[], float] = time.monotonic) -> None:
        self.seconds, self.memory, self.failure_count, self.next_at = seconds, RoundMemory(), 0, 0.0

    def __call__(self, container: Container) -> bool:
        return self.seconds() >= self.next_at and self.run_round(container)

    def run_round(self, container: Container) -> bool:
        outcome = container.get(LibrarySync).round(self.memory)
        self.failure_count = 0 if outcome.has_reached else self.failure_count + 1
        self.next_at = self.seconds() + self.wait_seconds()
        return outcome.has_changed

    def wait_seconds(self) -> float:
        return min(LONGEST_WAIT_SECONDS, INTERVAL_SECONDS * 2 ** self.failure_count) if self.failure_count else 0.0
