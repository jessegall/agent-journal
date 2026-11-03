from typing import ClassVar

from core.base.change.change import Change
from core.base.model.model import Model
from core.base.scope.scopes import DisabledScopes


class SaveListener:
    """Runs right after a change is saved, inside the same transaction, for what must be true together with
    it."""

    name: ClassVar[str]
    event: ClassVar[str]
    disabled_scopes: ClassVar[DisabledScopes] = ()

    def handle(self, change: Change[Model]) -> None:
        raise NotImplementedError(f"{type(self).__name__} handles nothing")
