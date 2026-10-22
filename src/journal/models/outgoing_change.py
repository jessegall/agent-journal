from dataclasses import dataclass
from typing import ClassVar

from journal.models.model import Model

CREATED = "created"
UPDATED = "updated"
DELETED = "deleted"


@dataclass(frozen=True)
class OutgoingChange(Model):
    """One write of a shared row waiting to be sent to the team server: the row's table and number, whether it was created, updated or deleted, the columns as stored with when each was changed, and who wrote it. Kept on this machine."""

    shared: ClassVar[bool] = False
    timeline_visible: ClassVar[bool] = False

    row_table: str = ""
    row: int = 0
    action: str = ""
    fields: dict | None = None
    changed_at: dict | None = None
    writer: str = ""
    is_sending: bool = False

    def merged(self, later: "OutgoingChange") -> "OutgoingChange | None":
        if later.action == DELETED:
            return None if self.action == CREATED else self.with_(action=DELETED, fields={}, changed_at={}, writer=later.writer)
        return self.with_(fields={**(self.fields or {}), **(later.fields or {})}, changed_at={**(self.changed_at or {}), **(later.changed_at or {})}, writer=later.writer)
