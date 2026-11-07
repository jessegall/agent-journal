from typing import ClassVar, Generic, TypeIs, TypeVar

from core.base.actor import Actor
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.scope.scopes import WholeScopes

C = TypeVar("C", bound=Command[object], contravariant=True)
R = TypeVar("R", covariant=True)


class Handler(Generic[C, R]):
    """Carries out one type of command: reads what it needs through queries and saves through the repository;
    work that must finish before the command's transaction opens belongs in prepare. A handler whose work
    cannot be repeated or undone sets runs_once, so a rollback cannot run that work again."""

    command: ClassVar[type[Command[object]]]
    runs_once: ClassVar[bool] = False
    caller_prepares: ClassVar[bool] = False
    disabled_scopes: ClassVar[WholeScopes] = ()

    def check_rows(self, command: C, actor: Actor) -> None:
        return None

    def prepare(self, command: C, actor: Actor) -> None:
        return None

    def handle(self, command: C, context: Context) -> R:
        raise NotImplementedError(f"{type(self).__name__} carries out nothing")


def is_handler_class(class_type: type) -> TypeIs[type[Handler[Command[object], object]]]:
    return issubclass(class_type, Handler)
