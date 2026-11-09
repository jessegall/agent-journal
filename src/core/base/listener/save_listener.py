from typing import ClassVar, TypeIs

from core.base.change.event_subscriber import E, EventSubscriber
from core.base.command.context import Context
from core.base.scope.scopes import DisabledScopes


class SaveListener(EventSubscriber[E]):
    """Runs right after a change is saved, inside the same transaction, for what must be true together with
    it."""

    name: ClassVar[str]
    disabled_scopes: ClassVar[DisabledScopes] = ()

    def handle(self, event: E, context: Context) -> None:
        raise NotImplementedError(f"{type(self).__name__} handles nothing")


def is_save_listener_class(class_type: type) -> TypeIs[type[SaveListener[object]]]:
    return issubclass(class_type, SaveListener)
