from collections.abc import Generator
from contextlib import contextmanager
from contextvars import ContextVar
from dataclasses import dataclass

from engine.enums.execution_priority import ExecutionPriority


@dataclass(frozen=True)
class CurrentExecution:
    """Who asks for the write turn: the priority it waits with, the class of what runs and its line."""

    priority: ExecutionPriority
    class_name: str | None = None
    line: str | None = None

    @classmethod
    def read(cls) -> "CurrentExecution":
        return CURRENT_EXECUTION.get()

    @contextmanager
    def applied(self) -> Generator["CurrentExecution"]:
        token = CURRENT_EXECUTION.set(self)
        try:
            yield self
        finally:
            CURRENT_EXECUTION.reset(token)


BACKGROUND_EXECUTION = CurrentExecution(ExecutionPriority.BACKGROUND)
CURRENT_EXECUTION: ContextVar[CurrentExecution] = ContextVar("current_execution", default=BACKGROUND_EXECUTION)
