from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.library.models.enums.copy_state import CopyState


@dataclass(frozen=True, kw_only=True)
class LibraryCopy(Model):
    """A local row that follows an item of the shared server: which item, the version and digest both sides last
    agreed on, and what keeps it from being in step, if anything."""

    model_name = "library_copy"
    cli_name = "library-copy"
    hidden_fields = frozenset({"server_fields"})

    creator_id: int
    share: str
    item_id: int
    row_id: int
    base_version: int
    base_digest: str
    state: CopyState = CopyState.SYNCED
    unsent_digest: str = ""
    server_version: int = 0
    server_fields: str = "{}"
    note: str = ""
