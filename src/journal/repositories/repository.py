from datetime import datetime, timezone
from typing import Generic, TypeVar

from journal.db.column import Column
from journal.db.connection import Connection
from journal.db.schema import Schema
from journal.events.models.created import Created
from journal.events.models.creating import Creating
from journal.events.models.deleted import Deleted
from journal.events.models.deleting import Deleting
from journal.events.models.saved import Saved
from journal.events.models.saving import Saving
from journal.events.models.updated import Updated
from journal.events.models.updating import Updating
from journal.features.bus import Bus
from journal.models.actor import Actor
from journal.models.model import Model
from journal.models.title import Title
from journal.repositories.not_found import NotFound

M = TypeVar("M", bound=Model)


class Repository(Generic[M]):
    """Reads and writes one model's table. Every write names its actor, stamps the row with it, and tells the bus at each step: saving, creating or updating, created or updated, saved; deleting, deleted."""

    model: type[M]

    def __init__(self, connection: Connection, bus: Bus) -> None:
        self.connection, self.bus = connection, bus
        self.columns: tuple[Column, ...] = Schema.columns(self.model)
        self.table = self.model.table()

    def find(self, id: int) -> M:
        row = self.connection.one(f"SELECT * FROM {self.table} WHERE id = ?", (id,))
        if row is None:
            raise NotFound(self.table, id)
        return self._load(row)

    def all(self) -> list[M]:
        return self.selected("1 ORDER BY id")

    def selected(self, clause: str, params: tuple = ()) -> list[M]:
        """The rows a WHERE clause picks, in the order and number it names."""
        return [self._load(row) for row in self.connection.all(f"SELECT * FROM {self.table} WHERE {clause}", params)]

    def where(self, **fields) -> list[M]:
        clause = " AND ".join(f"{name} = ?" for name in fields)
        params = tuple(self._column(name).to_sql(value) for name, value in fields.items())
        return self.selected(f"{clause} ORDER BY id", params)

    def page(self, limit: int, before: int | None = None, **fields) -> list[M]:
        """The newest rows first, at most limit of them, older than the id before when given; so a list never loads more than a screen."""
        where = [f"{name} = ?" for name in fields]
        params = [self._column(name).to_sql(value) for name, value in fields.items()]
        if before is not None:
            where.append("id < ?")
            params.append(before)
        return self.selected(f"{' AND '.join(where) or '1'} ORDER BY id DESC LIMIT ?", (*params, limit))

    def save(self, row: M, by: Actor) -> M:
        with self.connection.transaction():
            self.bus.dispatch(Saving(model=row, by=by))
            saved = self._insert(row, by) if row.is_new else self._update(row, by)
            self.bus.dispatch(Saved(model=saved, by=by))
            return saved

    def touch(self, row: M, by: Actor, **fields) -> M:
        """The named columns alone written, stamped, from the row as it stands in the database: two threads each touching their own column never write over each other."""
        with self.connection.transaction():
            was = self.find(row.id)
            stamped = was.with_(**fields, updated_at=self._now(), updated_by=by)
            names = [*fields, "updated_at", "updated_by"]
            values = tuple(self._column(name).to_sql(getattr(stamped, name)) for name in names)
            self.connection.execute(f"UPDATE {self.table} SET {', '.join(f'{name} = ?' for name in names)} WHERE id = ?", (*values, stamped.id))
            self.bus.dispatch(Updated(model=stamped, by=by, was=was))
            return stamped

    def delete(self, row: M, by: Actor) -> None:
        with self.connection.transaction():
            self.bus.dispatch(Deleting(model=row, by=by))
            self.connection.execute(f"DELETE FROM {self.table} WHERE id = ?", (row.id,))
            self.bus.dispatch(Deleted(model=row, by=by))

    def _insert(self, row: M, by: Actor) -> M:
        Title.check_on(row)
        now = self._now()
        stamped = row.with_(created_at=now, created_by=by, updated_at=now, updated_by=by)
        self.bus.dispatch(Creating(model=stamped, by=by))
        names = [column.name for column in self.columns if column.name != "id"]
        values = tuple(column.to_sql(getattr(stamped, column.name)) for column in self.columns if column.name != "id")
        cursor = self.connection.execute(f"INSERT INTO {self.table} ({', '.join(names)}) VALUES ({', '.join('?' for _ in names)})", values)
        created = stamped.with_(id=cursor.lastrowid)
        self.bus.dispatch(Created(model=created, by=by))
        return created

    def _update(self, row: M, by: Actor) -> M:
        stamped = row.with_(updated_at=self._now(), updated_by=by)
        was = self.find(row.id)
        Title.check_on(row, was)
        self.bus.dispatch(Updating(model=stamped, by=by))
        names = [column.name for column in self.columns if column.name != "id"]
        values = tuple(column.to_sql(getattr(stamped, column.name)) for column in self.columns if column.name != "id")
        self.connection.execute(f"UPDATE {self.table} SET {', '.join(f'{name} = ?' for name in names)} WHERE id = ?", (*values, stamped.id))
        self.bus.dispatch(Updated(model=stamped, by=by, was=was))
        return stamped

    def _load(self, row) -> M:
        """A NULL is a value the row never had, such as a column added after it was written: the model's own default stands in."""
        return self.model(**{column.name: value for column in self.columns if (value := column.from_sql(row[column.name])) is not None})

    def _column(self, name: str) -> Column:
        return next(column for column in self.columns if column.name == name)

    @staticmethod
    def _now() -> datetime:
        return datetime.now(timezone.utc)
