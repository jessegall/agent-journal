from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from engine.registry.inspector_listing import InspectorListing
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

    def listing(self, fingerprint: str, shareable: bool) -> InspectorListing:
        declaration = self.declaration
        links = {"categories": list(declaration.links.categories), "open": declaration.links.open, "excludes_plan": declaration.links.excludes_plan,
                 "page_size": declaration.links.page_size} if declaration.links is not None else None
        return InspectorListing(declaration.model_name, self.module, fingerprint, declaration.reads or f"{declaration.model_name} show {{row_id}}",
                                declaration.label, declaration.title, declaration.description, declaration.width.value,
                                [{"window": component.window, "tab": component.tab} for component in declaration.components],
                                declaration.comments, list(declaration.events), links, shareable, declaration.lists_fields, declaration.draws_text)

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "InspectorEntry":
        return cls(stored["module"], InspectorDeclaration.restored(stored["declaration"]), stored["shipped"])
