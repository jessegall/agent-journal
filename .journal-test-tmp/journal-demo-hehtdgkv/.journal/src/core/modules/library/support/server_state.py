from dataclasses import dataclass
from functools import cached_property

from core.modules.library.models.enums.library_role import LibraryRole
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError
from core.modules.library.support.state_entry import StateEntry


@dataclass(frozen=True)
class ServerState:
    """What one round reads from the server: its key, the role of this user, the tag that tells a later round
    nothing changed, and every item."""

    server_key: str
    role: LibraryRole
    etag: str
    entries: tuple[StateEntry, ...]

    @classmethod
    def parsed(cls, body: object) -> "ServerState":
        if not isinstance(body, dict):
            raise LibraryUnreachableError.unreadable()
        try:
            entries = tuple(StateEntry(str(entry["kind"]), int(entry["id"]), int(entry["version"]), bool(entry["removed"])) for entry in body["items"])
            return cls(str(body["server_key"]), LibraryRole(body["role"]), str(body["etag"]), entries)
        except (KeyError, TypeError, ValueError) as error:
            raise LibraryUnreachableError.unreadable() from error

    @cached_property
    def entry_index(self) -> dict[tuple[str, int], StateEntry]:
        return {(entry.share, entry.item_id): entry for entry in self.entries}

    def entry(self, share: str, item_id: int) -> StateEntry:
        return self.entry_index.get((share, item_id), StateEntry(share, item_id, 0, True))
