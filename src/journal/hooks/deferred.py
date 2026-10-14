import queue
import threading
from typing import Callable


class Deferred:
    """Work the server does after it has replied: one worker thread, in order, never on a request's thread."""

    def __init__(self) -> None: ...

    def start(self) -> None: ...

    def add(self, work: Callable[[], None]) -> None: ...

    def stop(self) -> None: ...
