from collections.abc import Callable

from engine.container.container import Container
from engine.ticker.tick_handler import TickHandler
from server.work.round_work import RoundWork


class TickHandlerWork(RoundWork):
    """One run of a tick handler; what it wrote then wakes the listener threads that hear it, whatever it answers."""

    def __init__(self, handler: TickHandler, wake_listeners: Callable[[], None]) -> None:
        self.handler, self.wake_listeners = handler, wake_listeners

    def run(self, container: Container) -> None:
        self.handler.handler(container)
        self.wake_listeners()
