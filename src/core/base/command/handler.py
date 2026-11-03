from typing import ClassVar, Generic, TypeIs, TypeVar

from core.base.actor import Actor
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.scope.scopes import WholeScopes

C = TypeVar("C", bound=Command[object], contravariant=True)
R = TypeVar("R", covariant=True)


class Handler(Generic[C, R]):
    """Carries out one type of command: reads what it needs through queries and saves through the repository;
    the work outside the database that must be done before its transaction opens, such as a program that
    writes to the journal itself, is done in prepare; a handler that only runs an outside program and saves
    nothing sets transactional to False, so its wait holds no write lock."""

    command: ClassVar[type[Command[object]]]
    transactional: ClassVar[bool] = True
    disabled_scopes: ClassVar[WholeScopes] = ()

    def prepare(self, command: C, actor: Actor) -> None:
        return None

    def handle(self, command: C, context: Context) -> R:
        raise NotImplementedError(f"{type(self).__name__} carries out nothing")


def is_handler_class(class_type: type) -> TypeIs[type[Handler[Command[object], object]]]:
    return issubclass(class_type, Handler)
