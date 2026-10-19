from datetime import datetime
from typing import TypeVar

from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.actor import Actor
from journal.models.scoped import Scoped
from journal.repositories.repository import Repository
from journal.repositories.scope import PROJECT, Scope

S = TypeVar("S", bound=Scoped)


class ScopedRepository(Repository[S]):
    """The same, within the scope's environment: every read sees only that environment's rows, so no read names it; a read across environments says so by its name; a new row that names none is placed in it."""

    def __init__(self, connection: Connection, bus: Bus, scope: Scope) -> None:
        super().__init__(connection, bus)
        self.scope = scope

    def selected(self, clause: str, params: tuple = ()) -> list[S]:
        return super().selected(f"environment_id = ? AND {clause}", (self.scope.id, *params))

    def with_project(self, clause: str, params: tuple = ()) -> list[S]:
        return super().selected(f"environment_id IN (?, ?) AND {clause}", (self.scope.id, PROJECT, *params))

    def across_environments(self, **fields) -> list[S]:
        clause, params = self.matching(fields)
        return self.selected_everywhere(f"{clause} ORDER BY id", params)

    def selected_everywhere(self, clause: str, params: tuple = ()) -> list[S]:
        return super().selected(clause, params)

    def aggregate(self, select: str, clause: str = "1", params: tuple = ()):
        return self.connection.one(f"SELECT {select} FROM {self.table} WHERE environment_id = ? AND {clause}", (self.scope.id, *params))

    def in_(self) -> list[S]:
        """The newest page of the scope's rows, oldest first."""
        return self.all()

    def counted_in(self, clause: str = "1", params: tuple = ()) -> int:
        """How many of the scope's rows a WHERE clause picks, counted by the database."""
        return self.aggregate("count(*) AS n", clause, params)["n"]

    def every_in(self) -> list[S]:
        """Every row of the scope, for the rare read that must see them all."""
        return self.every()

    def page_in(self, limit: int, before: int | None = None) -> list[S]:
        return self.page(limit, before)

    def _insert(self, row: S, by: Actor, now: datetime) -> S:
        return super()._insert(self._placed(row), by, now)

    def _placed(self, row: S) -> S:
        return row if row.environment_id else row.with_(environment_id=self.scope.id)
