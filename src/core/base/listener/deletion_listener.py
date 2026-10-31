from typing import ClassVar

from core.base.change.change import Change
from core.base.model.model import Model


class DeletionListener:
    """Runs before a row is deleted, inside the same transaction, so a module can remove or detach its own rows
    that point at it."""

    name: ClassVar[str]
    event: ClassVar[str]

    def handle(self, change: Change[Model]) -> None:
        raise NotImplementedError(f"{type(self).__name__} handles nothing")
