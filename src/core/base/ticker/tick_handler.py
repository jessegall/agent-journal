from collections.abc import Callable
from dataclasses import dataclass

from engine.container.container import Container
from core.base.ticker.tick_interval import TickInterval


@dataclass(frozen=True)
class TickHandler:
    """Code the ticker runs every interval, on its own thread and on a fresh container of the journal: a
    function of the container, or an object with a __call__ that keeps what it holds between runs. It
    answers True when it wrote what the listeners must see. A handler runs first after one interval, or at
    start with starts_immediately. Its name is its label in the error log and is unique, so a lambda needs
    one."""

    interval: TickInterval
    handler: Callable[[Container], bool | None]
    name: str = ""
    starts_immediately: bool = False

    @property
    def label(self) -> str:
        return self.name or type(self.handler).__name__
