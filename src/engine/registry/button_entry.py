from collections.abc import Mapping
from dataclasses import asdict, dataclass
from typing import Any

from engine.viewer.button_declaration import ButtonDeclaration


@dataclass(frozen=True)
class ButtonEntry:
    """A registered button and the module that supplies it."""

    module: str
    declaration: ButtonDeclaration
    shipped: bool
    warning: str = ""

    def listed(self) -> dict[str, Any]:
        listing = {**asdict(self.declaration), "module": self.module}
        if not self.shipped:
            listing["from"] = self.module
        if self.warning:
            listing["warning"] = self.warning
        return listing

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "ButtonEntry":
        return cls(stored["module"], ButtonDeclaration.restored(stored["declaration"]), stored["shipped"], stored.get("warning", ""))
