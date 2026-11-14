from engine.execution.execution_ticket import ExecutionTicket
import contextvars
import threading
from collections.abc import Callable, Generator
from contextlib import contextmanager
from contextvars import ContextVar
from dataclasses import dataclass

from engine.enums.execution_priority import ExecutionPriority


@dataclass(frozen=True)
class CurrentExecution:
    """Who asks for the write turn: the priority it waits with, the class of what runs, its line, and the instant
    lane ticket it holds, whose waited children the door gives to the programs it runs."""

    priority: ExecutionPriority
    class_name: str | None = None
    line: str | None = None
    ticket: ExecutionTicket | None = None

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


    # a thread a request starts waits with the request's own priority, which a plain thread would lose
    @staticmethod
    def thread(target: Callable[..., object], args: tuple[object, ...] = (), name: str | None = None) -> threading.Thread:
        context = contextvars.copy_context()
        return threading.Thread(target=context.run, args=(target, *args), name=name, daemon=True)


BACKGROUND_EXECUTION = CurrentExecution(ExecutionPriority.BACKGROUND)
CURRENT_EXECUTION: ContextVar[CurrentExecution] = ContextVar("current_execution", default=BACKGROUND_EXECUTION)
