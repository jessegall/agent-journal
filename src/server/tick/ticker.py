import queue as queue_module
import threading
import time
from collections.abc import Callable, Sequence

from engine.journal.journal_home import JournalHome
from engine.module.module_finder import ModuleFinder
from engine.ticker.due_tick_handlers import DueTickHandlers
from engine.ticker.tick_handler import TickHandler
from server.work.journal_round import JournalRound
from server.work.kept_round_container import KeptRoundContainer
from server.work.round_container import RoundContainer
from server.tick.tick_handler_work import TickHandlerWork
from server.tick.tick_worker import TickWorker
from server.hook.server_queue import ServerQueue

TICK_WORKER_COUNT = 3


class Ticker:
    """The server's one clock for timed code: each tick queues every handler whose interval has passed for a
    fixed set of worker threads, each with a container it keeps, so a slow handler holds one worker and no
    other handler, and a handler still queued or running is never queued again. A fault in a handler is logged
    under its name and stops nothing. The handlers are the modules' declared ones and those registered."""

    def __init__(self, home: JournalHome, handlers: Sequence[TickHandler], wake_listeners: Callable[[], None], seconds: Callable[[], float] = time.monotonic, queue: ServerQueue | None = None,
                 containers: Callable[[JournalHome], RoundContainer] = KeptRoundContainer, workers: int = TICK_WORKER_COUNT) -> None:
        self.home, self.wake_listeners, self.seconds = home, wake_listeners, seconds
        self.queue = queue
        self.due = DueTickHandlers(handlers, seconds())
        self.waiting_handlers: "queue_module.Queue[TickHandler]" = queue_module.Queue()
        self.busy: set[str] = set()
        self.labels_changed = threading.Condition()
        self.workers = [TickWorker(f"tick worker {number}", self.waiting_handlers, self.run, containers(home)) for number in range(1, workers + 1)]

    @staticmethod
    def module_handlers(finder: ModuleFinder) -> list[TickHandler]:
        return [handler for module in finder.modules() for handler in module.tick_handlers]

    def register(self, handler: TickHandler) -> None:
        self.due.register(handler)

    def start(self) -> None:
        for worker in self.workers:
            worker.start()

    def tick(self) -> None:
        for handler in self.due.start_due(self.seconds(), self.busy_labels()):
            self.queue_handler(handler)

    def busy_labels(self) -> set[str]:
        with self.labels_changed:
            return set(self.busy)

    def queue_handler(self, handler: TickHandler) -> None:
        with self.labels_changed:
            self.busy.add(handler.label)
        try:
            self.waiting_handlers.put(handler)
        except queue_module.ShutDown:
            self.release_label(handler)

    def run(self, handler: TickHandler, containers: RoundContainer) -> None:
        journal_round = JournalRound(self.home, handler.label, TickHandlerWork(handler, self.wake_listeners), containers, self.queue)
        try:
            journal_round.run()
        except Exception as error:
            journal_round.report(error)
        finally:
            self.release_label(handler)

    def release_label(self, handler: TickHandler) -> None:
        with self.labels_changed:
            self.busy.discard(handler.label)
            self.labels_changed.notify_all()

    def join(self, limit_seconds: float) -> None:
        with self.labels_changed:
            self.labels_changed.wait_for(lambda: not self.busy, max(0.0, limit_seconds))

    def stop(self, limit_seconds: float) -> None:
        self.waiting_handlers.shutdown(immediate=True)
        deadline = time.monotonic() + limit_seconds
        for thread in [worker.thread for worker in self.workers if worker.thread.is_alive()]:
            thread.join(max(0.0, deadline - time.monotonic()))
