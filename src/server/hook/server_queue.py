import itertools
import threading
from collections.abc import Generator
from contextlib import contextmanager
from time import monotonic

from core.base.request_queue import RequestQueue
from core.base.request_queue_entry import RequestQueueEntry
from core.base.request_queue_status import RequestQueueStatus
from core.base.viewer.window_priority import WindowPriority
from server.hook.hook_database_busy_error import HookDatabaseBusyError
from server.hook.queue_priority import QueuePriority
from server.hook.queue_request import QueueRequest

RUNNING_HOOKS_COUNT = 3
RUNNING_VIEWERS_COUNT = 4
RECENT_REQUESTS_SECONDS = 10.0
VIEWER_WAIT_LIMIT_SECONDS = 1.0
CLI_WAIT_LIMIT_SECONDS = 1.0


class ServerQueue(RequestQueue):
    """Orders hooks by priority, with at most one running per agent. A viewer request of a FIRST window runs at once;
    the others wait behind hooks, the window that sent fewest first, up to a limit, so none is starved."""

    def __init__(self, running_hooks_count: int = RUNNING_HOOKS_COUNT, viewer_wait_limit_seconds: float = VIEWER_WAIT_LIMIT_SECONDS, running_viewers_count: int = RUNNING_VIEWERS_COUNT, cli_wait_limit_seconds: float = CLI_WAIT_LIMIT_SECONDS) -> None:
        self.running_hooks_count, self.viewer_wait_limit_seconds = running_hooks_count, viewer_wait_limit_seconds
        self.running_viewers_count = running_viewers_count
        self.running_viewers = 0
        self.viewer_windows: dict[int, str] = {}
        self.sent_at: dict[str, list[float]] = {}
        self.main_hook_seconds, self.agent_hook_seconds = 0.0, 0.0
        self.changed = threading.Condition()
        self.waiting_hooks: list[tuple[QueuePriority, int, str]] = []
        self.running_owners: list[str] = []
        self.arrivals = itertools.count()
        self.waiting_requests: dict[int, QueueRequest] = {}
        self.running_requests: dict[int, RequestQueueEntry] = {}
        self.waiting_viewers: dict[int, QueueRequest] = {}
        self.waiting_cli: dict[int, QueueRequest] = {}
        self.running_cli = 0
        self.cli_wait_limit_seconds = cli_wait_limit_seconds

    @contextmanager
    def observing(self, request: QueueRequest) -> Generator[None]:
        number = next(self.arrivals)
        with self.changed:
            self.running_requests[number] = request.entry()
            self.changed.notify_all()
        try:
            yield
        finally:
            with self.changed:
                del self.running_requests[number]
                self.changed.notify_all()

    @contextmanager
    def cli_turn(self, request: QueueRequest) -> Generator[None]:
        number = next(self.arrivals)
        with self.changed:
            self.waiting_cli[number] = request
            self.changed.notify_all()
        try:
            self.claim_cli_turn(number)
            with self.changed:
                del self.waiting_cli[number]
                self.running_cli += 1
            try:
                with self.observing(request):
                    yield
            finally:
                with self.changed:
                    self.running_cli -= 1
                    self.changed.notify_all()
        finally:
            with self.changed:
                self.waiting_cli.pop(number, None)
                self.changed.notify_all()

    def claim_cli_turn(self, number: int) -> None:
        deadline = monotonic() + self.cli_wait_limit_seconds
        with self.changed:
            while self.running_owners or self.waiting_hooks or self.running_cli or number != min(self.waiting_cli):
                remaining = deadline - monotonic()
                if remaining <= 0:
                    return
                self.changed.wait(remaining)

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
    def viewer_turn(self, line: str, window: str = "", priority: WindowPriority = WindowPriority.NORMAL) -> Generator[None]:
        request = QueueRequest.started("Viewer", line, priority=priority.name.lower())
        number = next(self.arrivals)
        with self.changed:
            self.waiting_viewers[number] = request
            self.viewer_windows[number] = window
            self.note_sent(window)
            self.changed.notify_all()
        try:
            if priority is not WindowPriority.FIRST:
                self.claim_viewer_turn(number)
            with self.changed:
                del self.waiting_viewers[number]
                self.running_requests[number] = request.entry()
                self.running_viewers += 1
            try:
                yield
            finally:
                with self.changed:
                    del self.running_requests[number]
                    self.running_viewers -= 1
                    self.changed.notify_all()
        finally:
            with self.changed:
                self.waiting_viewers.pop(number, None)
                self.viewer_windows.pop(number, None)
                self.changed.notify_all()

    def claim_viewer_turn(self, number: int) -> None:
        deadline = monotonic() + self.viewer_wait_limit_seconds
        with self.changed:
            while not self.is_next_viewer(number):
                remaining = deadline - monotonic()
                if remaining <= 0:
                    return
                self.changed.wait(remaining)

    def is_next_viewer(self, number: int) -> bool:
        if self.running_owners or self.waiting_hooks or self.running_viewers >= self.running_viewers_count:
            return False
        return number == min(self.waiting_viewers, key=lambda waiting: (len(self.sent_at[self.viewer_windows[waiting]]), waiting))

    def note_sent(self, window: str) -> None:
        current_time = monotonic()
        self.sent_at[window] = [*(request_time for request_time in self.sent_at.get(window, ()) if current_time - request_time < RECENT_REQUESTS_SECONDS), current_time]

    def let_hooks_finish(self) -> None:
        self.wait_idle(self.viewer_wait_limit_seconds)

    def wait_idle(self, limit_seconds: float) -> None:
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
            cli = tuple(request.entry() for request in self.waiting_cli.values())
            return RequestQueueStatus(running, (*waiting, *cli, *viewers), self.running_hooks_count, self.viewer_wait_limit_seconds, self.main_hook_seconds, self.agent_hook_seconds)
