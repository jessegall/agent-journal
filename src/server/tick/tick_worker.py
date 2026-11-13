import queue
import threading
from collections.abc import Callable

from engine.ticker.tick_handler import TickHandler
from server.work.round_container import RoundContainer


class TickWorker:
    """One of the ticker's worker threads: it takes due handlers from the queue it shares with the other workers
    and runs each on the container it keeps for its life, which it closes from its own thread when it stops."""

    def __init__(self, name: str, handlers: "queue.Queue[TickHandler]", handler_runner: Callable[[TickHandler, RoundContainer], None], containers: RoundContainer) -> None:
        self.handlers, self.handler_runner, self.containers = handlers, handler_runner, containers
        self.thread = threading.Thread(target=self.loop, name=name, daemon=True)

    def start(self) -> None:
        self.thread.start()

    def loop(self) -> None:
        try:
            self.run_handlers()
        finally:
            self.containers.close()

    def run_handlers(self) -> None:
        while True:
            try:
                handler = self.handlers.get()
            except queue.ShutDown:
                return
            self.handler_runner(handler, self.containers)
