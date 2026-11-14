from server.execution.round_tickets import RoundTickets
from contextlib import nullcontext
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
from server.tick.queued_tick_handler import QueuedTickHandler
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from engine.time.clock import Clock
from core.modules.processes.models.enums.process_setting import ProcessSetting
from engine.setting.setting_values import SettingValues
from engine.container.container import Container

TICK_WORKER_COUNT = ProcessSetting.TICK_WORKERS.value.default
LATE_LINE_SECONDS = 300.0


class Ticker:
    """The server's one clock for timed code: each tick queues every handler whose interval has passed for a
    fixed set of worker threads, each with a container it keeps, so a slow handler holds one worker and no
    other handler, and a handler still queued or running is never queued again. A fault in a handler is logged
    under its name and stops nothing. The handlers are the modules' declared ones and those registered."""

    def __init__(self, home: JournalHome, handlers: Sequence[TickHandler], wake_listeners: Callable[[], None], seconds: Callable[[], float] = time.monotonic,
                 containers: Callable[[JournalHome], RoundContainer] = KeptRoundContainer, tickets: RoundTickets | None = None) -> None:
        self.home, self.wake_listeners, self.seconds = home, wake_listeners, seconds
        self.tickets = tickets
        self.due = DueTickHandlers(handlers, seconds())
        self.waiting_handlers: "queue_module.Queue[QueuedTickHandler]" = queue_module.Queue()
        self.busy: set[str] = set()
        self.labels_changed = threading.Condition()
        self.late_logged_seconds: dict[str, float] = {}
        self.containers = containers
        self.workers: list[TickWorker] = []

    @staticmethod
    def module_handlers(finder: ModuleFinder) -> list[TickHandler]:
        return [handler for module in finder.modules() for handler in module.tick_handlers]

    @staticmethod
    def worker_count(container: Container) -> int:
        return container.get(SettingValues).project.number(ProcessSetting.TICK_WORKERS.key)

    def register(self, handler: TickHandler) -> None:
        self.due.register(handler)

    def start(self, worker_count: int = TICK_WORKER_COUNT) -> None:
        self.workers = [TickWorker(f"tick worker {number}", self.waiting_handlers, self.run, self.containers(self.home)) for number in range(1, worker_count + 1)]
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
            self.waiting_handlers.put(QueuedTickHandler(handler, self.seconds()))
        except queue_module.ShutDown:
            self.release_label(handler)

    def run(self, queued: QueuedTickHandler, containers: RoundContainer) -> None:
        self.log_late_start(queued)
        handler = queued.handler
        journal_round = JournalRound(self.home, handler.label, TickHandlerWork(handler, self.wake_listeners), containers)
        try:
            with self.tickets.tick_turn(handler.label) if self.tickets is not None else nullcontext():
                journal_round.run()
        except Exception as error:
            journal_round.report(error)
        finally:
            self.release_label(handler)

    def log_late_start(self, queued: QueuedTickHandler) -> None:
        current_seconds, label = self.seconds(), queued.handler.label
        if not queued.has_waited_past_interval(current_seconds):
            return
        with self.labels_changed:
            if label in self.late_logged_seconds and current_seconds - self.late_logged_seconds[label] < LATE_LINE_SECONDS:
                return
            self.late_logged_seconds[label] = current_seconds
        SystemLogWriter(self.home, Clock()).write(LogLevel.INFORMATION, f"the ticker could not keep up: {label} waited {queued.waited_seconds(current_seconds):.0f} s for a worker"
                                                                         f" (interval {queued.handler.interval.seconds} s)")

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
            Clock().join(thread, max(0.0, deadline - time.monotonic()))
