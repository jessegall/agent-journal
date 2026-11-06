import itertools
import threading
from collections.abc import Generator
from contextlib import contextmanager
from time import monotonic

from server.hook.hook_database_busy_error import HookDatabaseBusyError
from server.hook.queue_priority import QueuePriority

RUNNING_HOOKS_COUNT = 1
VIEWER_WAIT_LIMIT_SECONDS = 1.0


class ServerQueue:
    """Decides what the server runs next: the main agent's hooks, then those of helpers and workers, each in the
    order they came. A viewer request waits while a hook runs or waits, up to a limit, so it is never starved."""

    def __init__(self, running_hooks_count: int = RUNNING_HOOKS_COUNT, viewer_wait_limit_seconds: float = VIEWER_WAIT_LIMIT_SECONDS) -> None:
        self.running_hooks_count, self.viewer_wait_limit_seconds = running_hooks_count, viewer_wait_limit_seconds
        self.changed = threading.Condition()
        self.waiting_hooks: list[tuple[QueuePriority, int]] = []
        self.running_hooks = 0
        self.arrivals = itertools.count()

    @contextmanager
    def hook_turn(self, priority: QueuePriority, wait_seconds: float) -> Generator[None]:
        self.take_hook_turn(priority, wait_seconds)
        try:
            yield
        finally:
            with self.changed:
                self.running_hooks -= 1
                self.changed.notify_all()

    def take_hook_turn(self, priority: QueuePriority, wait_seconds: float) -> None:
        place = (priority, next(self.arrivals))
        deadline = monotonic() + wait_seconds
        with self.changed:
            self.waiting_hooks.append(place)
            try:
                while self.running_hooks >= self.running_hooks_count or min(self.waiting_hooks) != place:
                    remaining = deadline - monotonic()
                    if remaining <= 0:
                        raise HookDatabaseBusyError(f"another hook held the journal for {wait_seconds:g} seconds")
                    self.changed.wait(remaining)
                self.running_hooks += 1
            finally:
                self.waiting_hooks.remove(place)
                self.changed.notify_all()

    def let_hooks_finish(self) -> None:
        deadline = monotonic() + self.viewer_wait_limit_seconds
        with self.changed:
            while self.running_hooks or self.waiting_hooks:
                remaining = deadline - monotonic()
                if remaining <= 0:
                    return
                self.changed.wait(remaining)
