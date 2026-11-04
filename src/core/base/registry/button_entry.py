from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from core.base.viewer.button_declaration import ButtonDeclaration


@dataclass(frozen=True)
class ButtonEntry:
    """A registered button and the module that supplies it."""

    module: str
    declaration: ButtonDeclaration
    shipped: bool

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "ButtonEntry":
        return cls(stored["module"], ButtonDeclaration.restored(stored["declaration"]), stored["shipped"])
