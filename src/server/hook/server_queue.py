import itertools
import threading
from collections.abc import Generator
from contextlib import contextmanager
from time import monotonic

from server.hook.hook_database_busy_error import HookDatabaseBusyError
from server.hook.queue_priority import QueuePriority

RUNNING_HOOKS_COUNT = 3
VIEWER_WAIT_LIMIT_SECONDS = 1.0


class ServerQueue:
    """Decides what the server runs next: the main agent's hooks, then those of helpers and workers, each in the
    order they came, several at once but one per agent. A viewer request waits while a hook runs or waits, up to a
    limit, so it is never starved."""

    def __init__(self, running_hooks_count: int = RUNNING_HOOKS_COUNT, viewer_wait_limit_seconds: float = VIEWER_WAIT_LIMIT_SECONDS) -> None:
        self.running_hooks_count, self.viewer_wait_limit_seconds = running_hooks_count, viewer_wait_limit_seconds
        self.changed = threading.Condition()
        self.waiting_hooks: list[tuple[QueuePriority, int, str]] = []
        self.running_owners: list[str] = []
        self.arrivals = itertools.count()

    @property
    def running_hooks(self) -> int:
        return len(self.running_owners)

    @contextmanager
    def hook_turn(self, priority: QueuePriority, wait_seconds: float, owner: str = "") -> Generator[None]:
        self.take_hook_turn(priority, wait_seconds, owner)
        try:
            yield
        finally:
            with self.changed:
                self.running_owners.remove(owner)
                self.changed.notify_all()

    def take_hook_turn(self, priority: QueuePriority, wait_seconds: float, owner: str) -> None:
        place = (priority, next(self.arrivals), owner)
        deadline = monotonic() + wait_seconds
        with self.changed:
            self.waiting_hooks.append(place)
            try:
                while not self.is_next(place):
                    remaining = deadline - monotonic()
                    if remaining <= 0:
                        raise HookDatabaseBusyError(f"another hook held the journal for {wait_seconds:g} seconds")
                    self.changed.wait(remaining)
                self.running_owners.append(owner)
            finally:
                self.waiting_hooks.remove(place)
                self.changed.notify_all()

    def is_next(self, place: tuple[QueuePriority, int, str]) -> bool:
        if self.running_hooks >= self.running_hooks_count:
            return False
        return place == min((waiting for waiting in self.waiting_hooks if waiting[2] not in self.running_owners), default=None)

    def let_hooks_finish(self) -> None:
        self.wait_until_idle(self.viewer_wait_limit_seconds)

    def wait_until_idle(self, limit_seconds: float) -> None:
        deadline = monotonic() + limit_seconds
        with self.changed:
            while self.running_owners or self.waiting_hooks:
                remaining = deadline - monotonic()
                if remaining <= 0:
                    return
                self.changed.wait(remaining)
