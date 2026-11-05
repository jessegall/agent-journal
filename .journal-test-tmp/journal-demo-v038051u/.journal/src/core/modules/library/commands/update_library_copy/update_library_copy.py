from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.library.models.enums.copy_state import CopyState
from core.modules.library.models.library_copy import LibraryCopy


@dataclass(frozen=True)
class UpdateLibraryCopy(Command[LibraryCopy]):
    """Writes what a round found about a copy: its state, and each stored value that is given. A value that is not
    given stays as it is."""

    copy_id: int
    state: CopyState
    note: str | None = None
    unsent_digest: str | None = None
    server_version: int | None = None
    server_fields: str | None = None
    base_version: int | None = None
    base_digest: str | None = None

    @classmethod
    def synced(cls, copy_id: int, base_version: int | None = None, base_digest: str | None = None) -> "UpdateLibraryCopy":
        return cls(copy_id, CopyState.SYNCED, "", "", 0, "{}", base_version, base_digest)
