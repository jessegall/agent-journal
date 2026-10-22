from dataclasses import dataclass, field

from journal.models.outgoing_change import CREATED, DELETED
from journal.support.actor import Actor
from sync_server.logged_change import LoggedChange


@dataclass(frozen=True)
class TeamChange:
    """One change to a shared row as the team server passes it on: the row's table and number, whether it was created, updated or deleted, its columns as stored, and who wrote it."""

    row_table: str
    row: int
    action: str
    writer: str
    fields: dict = field(default_factory=dict)

    def is_creation(self) -> bool:
        return self.action == CREATED

    def is_deletion(self) -> bool:
        return self.action == DELETED

    def actor(self) -> Actor:
        return Actor.parse(self.writer)

    def fields_without(self, names: set[str]) -> dict:
        return {name: value for name, value in self.fields.items() if name not in names}

    @classmethod
    def logged(cls, change: LoggedChange) -> "TeamChange":
        return cls(change.row_table, change.row, change.action, change.actor, dict(change.fields))
