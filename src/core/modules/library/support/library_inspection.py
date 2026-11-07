from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.base.library.library_item import LibraryItem
from core.modules.library.support.library_versions import LibraryVersions


@dataclass(frozen=True)
class LibraryInspection:
    """An item and its versions."""

    item: LibraryItem
    versions: LibraryVersions

    def lines(self) -> Sequence[str]:
        return [*self.item.lines(), *self.versions.lines()]

    def json(self) -> Mapping[str, object]:
        return {"item": self.item.json(), "versions": [change.json() for change in self.versions.changes]}
