from dataclasses import dataclass, field

from core.modules.library.models.library_copy import LibraryCopy
from core.modules.library.support.server_state import ServerState
from core.modules.library.support.state_entry import StateEntry


@dataclass
class RoundMemory:
    """What a series of sync rounds keeps between them: the last list of the server with its tag, and the versions
    of an item that failed a local check, which are not tried again."""

    state: ServerState | None = None
    skipped: set[tuple[int, int]] = field(default_factory=set[tuple[int, int]])

    def is_skipped(self, copy: LibraryCopy, entry: StateEntry) -> bool:
        return (copy.id, entry.version) in self.skipped

    def skip(self, copy: LibraryCopy, entry: StateEntry) -> None:
        self.skipped.add((copy.id, entry.version))
