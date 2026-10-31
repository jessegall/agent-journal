from typing import ClassVar, Generic, TypeVar

from core.base.command.command import Command
from core.base.command.context import Context

C = TypeVar("C", bound=Command[object], contravariant=True)
R = TypeVar("R", covariant=True)


class Handler(Generic[C, R]):
    """Carries out one kind of command: reads what it needs through queries and saves through the repository."""

    command: ClassVar[type[Command[object]]]

    def handle(self, command: C, context: Context) -> R:
        raise NotImplementedError(f"{type(self).__name__} carries out nothing")
