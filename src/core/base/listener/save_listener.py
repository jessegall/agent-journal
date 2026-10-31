from typing import ClassVar

from core.base.change.change import Change
from core.base.model.model import Model


class SaveListener:
    """Runs right after a change is saved, inside the same transaction, for what must be true together with it."""

    name: ClassVar[str]
    event: ClassVar[str]

    def handle(self, change: Change[Model]) -> None:
        raise NotImplementedError(f"{type(self).__name__} handles nothing")
