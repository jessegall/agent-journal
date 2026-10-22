from dataclasses import dataclass, field, replace

CREATED = "created"
UPDATED = "updated"
DELETED = "deleted"


@dataclass(frozen=True)
class LoggedChange:
    """One change in the team's log: its place in the order, the row's table and number, whether it was created, updated or deleted, the fields it set with when each was changed, who wrote it, and the person and device that sent it."""

    row_table: str
    row: int
    action: str
    actor: str
    account_id: int
    device_id: int
    fields: dict = field(default_factory=dict)
    changed_at: dict = field(default_factory=dict)
    sequence: int = 0


    def without(self, names: set[str]) -> "LoggedChange":
        return replace(self, fields={name: value for name, value in self.fields.items() if name not in names}, changed_at={name: value for name, value in self.changed_at.items() if name not in names})

    def is_update(self) -> bool:
        return self.action == UPDATED

    def is_deletion(self) -> bool:
        return self.action == DELETED
