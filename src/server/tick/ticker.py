import threading
import time
from collections.abc import Callable, Sequence

from engine.journal.journal_home import JournalHome
from engine.module.module_finder import ModuleFinder
from engine.ticker.due_tick_handlers import DueTickHandlers
from engine.ticker.tick_handler import TickHandler
from server.work.journal_round import JournalRound
from server.tick.tick_handler_work import TickHandlerWork
from server.hook.server_queue import ServerQueue


class Ticker:
    """The server's one clock for timed code: each tick starts every handler whose interval has passed on a
    thread of its own, so a slow handler holds up no other, and never starts one that still runs. A fault in a
    handler is logged under its name and stops nothing. The handlers are the modules' declared ones and those
    registered."""

    def __init__(self, home: JournalHome, handlers: Sequence[TickHandler], wake_listeners: Callable[[], None], seconds: Callable[[], float] = time.monotonic, queue: ServerQueue | None = None) -> None:
        self.home, self.wake_listeners, self.seconds = home, wake_listeners, seconds
        self.queue = queue
        self.due = DueTickHandlers(handlers, seconds())
        self.threads: dict[str, threading.Thread] = {}

    @staticmethod
    def module_handlers(finder: ModuleFinder) -> list[TickHandler]:
        return [handler for module in finder.modules() for handler in module.tick_handlers]

    def register(self, handler: TickHandler) -> None:
        self.due.register(handler)

    def tick(self) -> None:
        for handler in self.due.start_due(self.seconds(), self.running_labels()):
            self.start(handler)

    def running_labels(self) -> set[str]:
        return {label for label, thread in self.threads.items() if thread.is_alive()}

    def start(self, handler: TickHandler) -> None:
        thread = threading.Thread(target=self.run, args=[handler], name=handler.label, daemon=True)
        self.threads[handler.label] = thread
        thread.start()

    def run(self, handler: TickHandler) -> None:
        journal_round = JournalRound(self.home, handler.label, TickHandlerWork(handler, self.wake_listeners), queue=self.queue)
        try:
            journal_round.run()
        except Exception as error:
            journal_round.report(error)

    def join(self, limit_seconds: float) -> None:
        deadline = time.monotonic() + limit_seconds
        for thread in tuple(self.threads.values()):
            if thread.is_alive():
                thread.join(max(0.0, deadline - time.monotonic()))
