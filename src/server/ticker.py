import math
import threading
import time
from collections.abc import Callable, Sequence

from core.base.journal_home import JournalHome
from core.base.module.module_finder import ModuleFinder
from core.base.ticker.tick_handler import TickHandler
from server.journal_round import JournalRound
from server.tick_handler_work import TickHandlerWork


class Ticker:
    """The server's one clock for timed code: each tick starts every handler whose interval has passed on a thread
    of its own, so a slow handler holds up no other, and never starts one that still runs. A fault in a handler is
    logged under its name and stops nothing. The handlers are the modules' declared ones and those registered."""

    def __init__(self, home: JournalHome, handlers: Sequence[TickHandler], wake_listeners: Callable[[], None], seconds: Callable[[], float] = time.monotonic) -> None:
        self.home, self.wake_listeners, self.seconds = home, wake_listeners, seconds
        self.handlers: list[TickHandler] = []
        self.began_at = seconds()
        self.started_at: dict[str, float] = {}
        self.threads: dict[str, threading.Thread] = {}
        for handler in handlers:
            self.register(handler)

    @staticmethod
    def declared_by(finder: ModuleFinder) -> list[TickHandler]:
        return [handler for module in finder.modules() for handler in module.tick_handlers]

    def register(self, handler: TickHandler) -> None:
        if any(other.label == handler.label for other in self.handlers):
            raise ValueError(f"a tick handler named {handler.label} is registered already")
        self.handlers.append(handler)

    def tick(self) -> None:
        now = self.seconds()
        for handler in self.handlers:
            if self.is_due(handler, now) and not self.is_running(handler):
                self.start(handler, now)

    def is_due(self, handler: TickHandler, now: float) -> bool:
        last = self.started_at.get(handler.label, -math.inf if handler.at_start else self.began_at)
        return now - last >= handler.interval.seconds

    def is_running(self, handler: TickHandler) -> bool:
        thread = self.threads.get(handler.label)
        return thread is not None and thread.is_alive()

    def start(self, handler: TickHandler, now: float) -> None:
        self.started_at[handler.label] = now
        thread = threading.Thread(target=self.run, args=(handler,), name=handler.label, daemon=True)
        self.threads[handler.label] = thread
        thread.start()

    def run(self, handler: TickHandler) -> None:
        journal_round = JournalRound(self.home, handler.label, TickHandlerWork(handler, self.wake_listeners))
        try:
            journal_round.run()
        except Exception as error:
            journal_round.report(error)

    def join(self, limit_seconds: float) -> None:
        deadline = time.monotonic() + limit_seconds
        for thread in tuple(self.threads.values()):
            if thread.is_alive():
                thread.join(max(0.0, deadline - time.monotonic()))
