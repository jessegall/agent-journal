from contextvars import ContextVar
from typing import Callable

CURRENT: ContextVar[Callable[[], int]] = ContextVar("environment")


class ScopeBinding:
    """The environment a block of work is in, set as the block is entered and put back as it is left."""

    def __init__(self, environment: Callable[[], int]) -> None:
        self.environment = environment

    def __enter__(self) -> None:
        self.token = CURRENT.set(self.environment)

    def __exit__(self, *raised: object) -> None:
        CURRENT.reset(self.token)
