from typing import TypeVar

from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.actor import Actor
from journal.models.scoped import Scoped
from journal.repositories.repository import Repository
from journal.repositories.scope import Scope

S = TypeVar("S", bound=Scoped)


class ScopedRepository(Repository[S]):
    """The same, within the scope's environment: its reads see only that environment's rows, and a new row that names none is placed in it."""

    def __init__(self, connection: Connection, bus: Bus, scope: Scope) -> None:
        super().__init__(connection, bus)
        self.scope = scope

    def in_(self) -> list[S]:
        """The newest page of the scope's rows, oldest first."""
        return self.where(environment_id=self.scope.id)

    def counted_in(self, clause: str = "1", params: tuple = ()) -> int:
        """How many of the scope's rows a WHERE clause picks, counted by the database."""
        return self.connection.one(f"SELECT count(*) AS n FROM {self.table} WHERE environment_id = ? AND {clause}", (self.scope.id, *params))["n"]

    def every_in(self) -> list[S]:
        """Every row of the scope, for the rare read that must see them all."""
        return self.every_where(environment_id=self.scope.id)

    def page_in(self, limit: int, before: int | None = None) -> list[S]:
        return self.page(limit, before, environment_id=self.scope.id)

    def _insert(self, row: S, by: Actor) -> S:
        return super()._insert(self._placed(row), by)

    def _placed(self, row: S) -> S:
        return row if row.environment_id else row.with_(environment_id=self.scope.id)
