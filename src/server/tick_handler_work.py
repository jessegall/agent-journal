from collections.abc import Callable

from engine.container.container import Container
from core.base.ticker.tick_handler import TickHandler
from server.round_work import RoundWork


class TickHandlerWork(RoundWork):
    """One run of a tick handler on a fresh container; the listeners are woken when the handler answers True."""

    def __init__(self, handler: TickHandler, wake_listeners: Callable[[], None]) -> None:
        self.handler, self.wake_listeners = handler, wake_listeners

    def run(self, container: Container) -> None:
        if self.handler.handler(container):
            self.wake_listeners()
