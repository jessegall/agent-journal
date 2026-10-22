from datetime import datetime
from typing import TypeVar

from journal.db.connection import Connection
from journal.db.query import Query
from journal.events.bus import Bus
from journal.support.actor import Actor
from journal.models.scoped import Scoped
from journal.repositories.repository import Repository
from journal.repositories.scope import PROJECT, Scope

S = TypeVar("S", bound=Scoped)


class ScopedRepository(Repository[S]):
    """The same, within the scope's environment: every read sees only that environment's rows, so no read names it; a read across environments says so by its name; a new row that names none is placed in it."""

    def __init__(self, connection: Connection, bus: Bus, scope: Scope) -> None:
        super().__init__(connection, bus)
        self.scope = scope

    def selected(self, query: Query) -> list[S]:
        return super().selected(self._scoped(query))

    def with_project(self, query: Query) -> list[S]:
        return super().selected(query.filter_listed("environment_id", (self.scope.id, PROJECT)))

    def global_matching(self, **fields) -> list[S]:
        return self.selected_globally(self.query().filter(**fields).order("id"))

    def selected_globally(self, query: Query) -> list[S]:
        return super().selected(query)

    def counted(self, query: Query) -> int:
        return self.connection.result(*self._scoped(query).count())["value"]

    def maximum(self, query: Query, column: str, empty_value):
        return self.connection.result(*self._scoped(query).maximum(column, empty_value))["value"]

    def repeated(self, query: Query, column: str, minimum: int) -> list:
        return [row["value"] for row in self.connection.all(*self._scoped(query).repeated(column, minimum))]

    def scoped(self) -> list[S]:
        return self.all()

    def count(self) -> int:
        return self.counted(self.query())

    def scoped_rows(self) -> list[S]:
        return self.rows()

    def scoped_page(self, limit: int, previous: int | None = None) -> list[S]:
        return self.page(limit, previous)

    def _insert(self, row: S, actor: Actor, time: datetime) -> S:
        return super()._insert(self._placed(row), actor, time)

    def _scoped(self, query: Query) -> Query:
        return query.filter(environment_id=self.scope.id)

    def _placed(self, row: S) -> S:
        return row if row.environment_id else row.with_(environment_id=self.scope.id)
