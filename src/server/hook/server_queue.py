import itertools
import threading
from collections.abc import Generator
from contextlib import contextmanager
from time import monotonic

from core.base.request_queue import RequestQueue, RequestQueueEntry, RequestQueueSnapshot
from server.hook.hook_database_busy_error import HookDatabaseBusyError
from server.hook.queue_priority import QueuePriority
from server.hook.queue_request import QueueRequest

RUNNING_HOOKS_COUNT = 1
VIEWER_WAIT_LIMIT_SECONDS = 1.0


class ServerQueue(RequestQueue):
    """Orders hook requests and lets viewer requests wait for hooks."""

    def __init__(self, running_hooks_count: int = RUNNING_HOOKS_COUNT, viewer_wait_limit_seconds: float = VIEWER_WAIT_LIMIT_SECONDS) -> None:
        self.running_hooks_count, self.viewer_wait_limit_seconds = running_hooks_count, viewer_wait_limit_seconds
        self.main_hook_seconds, self.agent_hook_seconds = 0.0, 0.0
        self.changed = threading.Condition()
        self.waiting_hooks: list[tuple[QueuePriority, int]] = []
        self.running_hooks = 0
        self.arrivals = itertools.count()
        self.waiting_requests: dict[int, QueueRequest] = {}
        self.running_requests: dict[int, RequestQueueEntry] = {}
        self.waiting_viewers: dict[int, QueueRequest] = {}

    @contextmanager
    def hook_turn(self, priority: QueuePriority, wait_seconds: float, request: QueueRequest | None = None) -> Generator[None]:
        request = request or QueueRequest.started("Main agent" if priority is QueuePriority.MAIN_AGENT_HOOK else "Worker", "hook")
        place = (priority, next(self.arrivals))
        self.take_hook_turn(place, wait_seconds, request)
        try:
            yield
        finally:
            with self.changed:
                self.running_hooks -= 1
                del self.running_requests[place[1]]
                self.changed.notify_all()

    def take_hook_turn(self, place: tuple[QueuePriority, int], wait_seconds: float, request: QueueRequest) -> None:
        deadline = monotonic() + wait_seconds
        with self.changed:
            self.waiting_hooks.append(place)
            self.waiting_requests[place[1]] = request
            self.changed.notify_all()
            try:
                while self.running_hooks >= self.running_hooks_count or min(self.waiting_hooks) != place:
                    remaining = deadline - monotonic()
                    if remaining <= 0:
                        raise HookDatabaseBusyError(f"another hook held the journal for {wait_seconds:g} seconds")
                    self.changed.wait(remaining)
                self.running_hooks += 1
                self.running_requests[place[1]] = request.entry()
            finally:
                self.waiting_hooks.remove(place)
                del self.waiting_requests[place[1]]
                self.changed.notify_all()

    @contextmanager
    def viewer_turn(self, line: str) -> Generator[None]:
        request = QueueRequest.started("Viewer", line)
        number = next(self.arrivals)
        with self.changed:
            self.waiting_viewers[number] = request
            self.changed.notify_all()
        try:
            self.let_hooks_finish()
            with self.changed:
                del self.waiting_viewers[number]
                self.running_requests[number] = request.entry()
            try:
                yield
            finally:
                with self.changed:
                    del self.running_requests[number]
        finally:
            with self.changed:
                self.waiting_viewers.pop(number, None)

    def let_hooks_finish(self) -> None:
        deadline = monotonic() + self.viewer_wait_limit_seconds
        with self.changed:
            while self.running_hooks or self.waiting_hooks:
                remaining = deadline - monotonic()
                if remaining <= 0:
                    return
                self.changed.wait(remaining)

    def snapshot(self) -> RequestQueueSnapshot:
        with self.changed:
            running = tuple(self.running_requests.values())
            waiting = tuple(self.waiting_requests[number].entry() for _, number in sorted(self.waiting_hooks))
            viewers = tuple(request.entry() for request in self.waiting_viewers.values())
            return RequestQueueSnapshot(running, (*waiting, *viewers), self.running_hooks_count, self.viewer_wait_limit_seconds, self.main_hook_seconds, self.agent_hook_seconds)
