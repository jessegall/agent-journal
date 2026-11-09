from typing import ClassVar, Generic, TypeIs, TypeVar

from core.base.actor import Actor
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.scope.scopes import WholeScopes

C = TypeVar("C", bound=Command[object], contravariant=True)
R = TypeVar("R", covariant=True)


class Handler(Generic[C, R]):
    """Runs a command; check_rows refuses queued work, and prepare runs before its transaction."""

    command: ClassVar[type[Command[object]]]
    runs_once: ClassVar[bool] = False
    caller_prepares: ClassVar[bool] = False
    disabled_scopes: ClassVar[WholeScopes] = ()

    def check_rows(self, command: C, actor: Actor) -> None:
        return None

    def prepare(self, command: C, actor: Actor) -> None:
        return None

    @property
    def has_prepare_step(self) -> bool:
        return type(self).prepare is not Handler[Command[object], object].prepare

    def handle(self, command: C, context: Context) -> R:
        raise NotImplementedError(f"{type(self).__name__} carries out nothing")


def is_handler_class(class_type: type) -> TypeIs[type[Handler[Command[object], object]]]:
    return issubclass(class_type, Handler)
