from typing import ClassVar, Generic, TypeIs, TypeVar

from core.base.command.command import Command
from core.base.command.context import Context

C = TypeVar("C", bound=Command[object], contravariant=True)
R = TypeVar("R", covariant=True)


class Handler(Generic[C, R]):
    """Carries out one type of command: reads what it needs through queries and saves through the repository."""

    command: ClassVar[type[Command[object]]]

    def handle(self, command: C, context: Context) -> R:
        raise NotImplementedError(f"{type(self).__name__} carries out nothing")


def is_handler_class(class_type: type) -> TypeIs[type[Handler[Command[object], object]]]:
    return issubclass(class_type, Handler)
