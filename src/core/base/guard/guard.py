from typing import ClassVar

from core.base.change.change import Change
from core.base.model.model import Model


class Guard:
    """One rule a change must pass before it is saved; the class's docstring states the rule."""

    name: ClassVar[str]
    event: ClassVar[str]
    short_flag: ClassVar[str] = ""

    def check(self, change: Change[Model]) -> None:
        raise NotImplementedError(f"{type(self).__name__} states no check")
