from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.library.support.library_page import LibraryPage


@dataclass(frozen=True)
class LibraryListing:
    """The pages of the shared library shown together."""

    pages: Sequence[LibraryPage]

    def lines(self) -> Sequence[str]:
        return [line for page in self.pages for line in page.lines()]

    def json(self) -> Mapping[str, object]:
        return {"rows": [item.json() for page in self.pages for item in page.items]}
