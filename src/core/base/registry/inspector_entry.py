from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from core.base.viewer.inspector_declaration import InspectorDeclaration


@dataclass(frozen=True)
class InspectorEntry:
    """A registered inspector and the module that supplies it."""

    module: str
    declaration: InspectorDeclaration
    shipped: bool

    def stored(self) -> dict[str, Any]:
        return {"module": self.module, "declaration": self.declaration.stored(), "shipped": self.shipped}

    def listed(self) -> dict[str, Any]:
        listing = {**self.declaration.stored(), "module": self.module}
        if not self.shipped:
            listing["from"] = self.module
        return listing

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "InspectorEntry":
        return cls(stored["module"], InspectorDeclaration.restored(stored["declaration"]), stored["shipped"])
