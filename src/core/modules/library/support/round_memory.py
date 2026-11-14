from dataclasses import dataclass, field

from engine.model.model import Model
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.server_state import ServerState
from core.modules.library.support.state_entry import StateEntry


@dataclass
class RoundMemory:
    """What a series of sync rounds keeps between them: the last list of the server with its tag, and the
    versions of an item that failed a local check, which are not tried again, and the versions of the copy,
    its row and its server entry when the copy was last found in step with them, so a copy that none of
    them changed is not compared again."""

    state: ServerState | None = None
    skipped: set[tuple[int, int]] = field(default_factory=set[tuple[int, int]])
    unchanged_versions: dict[int, tuple[int, int, int]] = field(default_factory=dict[int, tuple[int, int, int]])

    def is_skipped(self, copy: LibraryCopy, entry: StateEntry) -> bool:
        return (copy.id, entry.version) in self.skipped

    def skip(self, copy: LibraryCopy, entry: StateEntry) -> None:
        self.skipped.add((copy.id, entry.version))

    def is_unchanged(self, copy: LibraryCopy, row: Model, entry: StateEntry) -> bool:
        return self.unchanged_versions.get(copy.id) == (copy.version, row.version, entry.version)

    def remember_unchanged(self, copy: LibraryCopy, row: Model, entry: StateEntry) -> None:
        self.unchanged_versions[copy.id] = (copy.version, row.version, entry.version)
