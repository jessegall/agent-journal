from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class CopyStatusView:
    """The fields of one copy's status as the Teams page reads them: the item, the status, the note, and the text
    here and in the library."""

    copy_id: int
    share: str
    row_id: int
    item_id: int
    version: int
    status: str
    label: str
    note: str
    server_version: int
    local_fields: Mapping[str, object]
    server_fields: Mapping[str, object]
