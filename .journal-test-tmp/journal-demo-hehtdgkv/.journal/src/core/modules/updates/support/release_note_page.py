from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.updates.support.release_note import ReleaseNote


@dataclass(frozen=True)
class ReleaseNotePage:
    """One page of published releases, newest first, and whether older ones follow."""

    notes: tuple[ReleaseNote, ...]
    is_last_page: bool

    def json(self) -> Mapping[str, object]:
        return {"notes": [note.json() for note in self.notes], "is_last_page": self.is_last_page}
