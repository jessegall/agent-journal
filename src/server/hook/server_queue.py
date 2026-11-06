import itertools
import threading
from collections.abc import Generator
from contextlib import contextmanager
from time import monotonic

from core.base.request_queue import RequestQueue
from core.base.request_queue_entry import RequestQueueEntry
from core.base.request_queue_status import RequestQueueStatus
from server.hook.hook_database_busy_error import HookDatabaseBusyError
from server.hook.queue_priority import QueuePriority
from server.hook.queue_request import QueueRequest

RUNNING_HOOKS_COUNT = 3
VIEWER_WAIT_LIMIT_SECONDS = 1.0


class ServerQueue(RequestQueue):
    """Orders hooks by priority, with at most one running per agent, and lets viewers wait for hooks."""

    def __init__(self, running_hooks_count: int = RUNNING_HOOKS_COUNT, viewer_wait_limit_seconds: float = VIEWER_WAIT_LIMIT_SECONDS) -> None:
        self.running_hooks_count, self.viewer_wait_limit_seconds = running_hooks_count, viewer_wait_limit_seconds
        self.main_hook_seconds, self.agent_hook_seconds = 0.0, 0.0
        self.changed = threading.Condition()
        self.waiting_hooks: list[tuple[QueuePriority, int, str]] = []
        self.running_owners: list[str] = []
        self.arrivals = itertools.count()
        self.waiting_requests: dict[int, QueueRequest] = {}
        self.running_requests: dict[int, RequestQueueEntry] = {}
        self.waiting_viewers: dict[int, QueueRequest] = {}

    @property
    def running_hooks(self) -> int:
        return len(self.running_owners)

    @contextmanager
    def hook_turn(self, priority: QueuePriority, wait_seconds: float, owner: str = "", request: QueueRequest | None = None) -> Generator[None]:
        request = request or QueueRequest.started("Main agent" if priority is QueuePriority.MAIN_AGENT_HOOK else "Worker", "hook")
        place = (priority, next(self.arrivals), owner)
        self.start_hook(place, wait_seconds, request)
        try:
            yield
        finally:
            with self.changed:
                self.running_owners.remove(owner)
                del self.running_requests[place[1]]
                self.changed.notify_all()

    def start_hook(self, place: tuple[QueuePriority, int, str], wait_seconds: float, request: QueueRequest) -> None:
        deadline = monotonic() + wait_seconds
        with self.changed:
            self.waiting_hooks.append(place)
            self.waiting_requests[place[1]] = request
            self.changed.notify_all()
            try:
                while not self.is_next(place):
                    remaining = deadline - monotonic()
                    if remaining <= 0:
                        raise HookDatabaseBusyError(f"another hook held the journal for {wait_seconds:g} seconds")
                    self.changed.wait(remaining)
                self.running_owners.append(place[2])
                self.running_requests[place[1]] = request.entry()
            finally:
                self.waiting_hooks.remove(place)
                del self.waiting_requests[place[1]]
                self.changed.notify_all()

    def is_next(self, place: tuple[QueuePriority, int, str]) -> bool:
        if self.running_hooks >= self.running_hooks_count:
            return False
        return place == min((waiting for waiting in self.waiting_hooks if waiting[2] not in self.running_owners), default=None)

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
        self.wait_until_idle(self.viewer_wait_limit_seconds)

    def wait_until_idle(self, limit_seconds: float) -> None:
        deadline = monotonic() + limit_seconds
        with self.changed:
            while self.running_owners or self.waiting_hooks:
                remaining = deadline - monotonic()
                if remaining <= 0:
                    return
                self.changed.wait(remaining)

    def read(self) -> RequestQueueStatus:
        with self.changed:
            running = tuple(self.running_requests.values())
            ordered = sorted(self.waiting_hooks, key=lambda place: (place[2] in self.running_owners, place[0], place[1]))
            waiting = tuple(self.waiting_requests[number].entry() for _, number, _ in ordered)
            viewers = tuple(request.entry() for request in self.waiting_viewers.values())
            return RequestQueueStatus(running, (*waiting, *viewers), self.running_hooks_count, self.viewer_wait_limit_seconds, self.main_hook_seconds, self.agent_hook_seconds)
