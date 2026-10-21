from dataclasses import fields
from datetime import datetime, timezone
from typing import Callable, Generic, TypeVar

from journal.support.column import Column
from journal.db.connection import Connection
from journal.db.schema import Schema
from journal.events.models.created import Created
from journal.events.models.creating import Creating
from journal.events.models.deleted import Deleted
from journal.events.models.deleting import Deleting
from journal.events.models.saved import Saved
from journal.events.models.saving import Saving
from journal.events.models.updated import Updated
from journal.events.rows.row_event import RowEvent
from journal.events.models.updating import Updating
from journal.events.bus import Bus
from journal.support.actor import Actor
from journal.models.model import Model
from journal.support.ref import Ref
from journal.support.title import Title
from journal.support.not_found import NotFound

M = TypeVar("M", bound=Model)


PAGE = 500
"""The most rows a read returns unless it asks for every one by name."""
FOUND = 40
"""The most rows a search returns of one kind."""


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
        return self.newest("1", ())

    def every(self) -> list[M]:
        return self.selected("1 ORDER BY id")

    def selected(self, clause: str, params: tuple = ()) -> list[M]:
        return [self._load(row) for row in self.connection.all(f"SELECT * FROM {self.table} WHERE {clause}", params)]

    def linked(self, kind: str) -> dict[int, list[Ref]]:
        return self._linked("kind = ? AND ", (kind,))

    def every_linked(self) -> dict[int, list[Ref]]:
        return self._linked("", ())

    def _linked(self, clause: str, params: tuple) -> dict[int, list[Ref]]:
        found: dict[int, list[Ref]] = {}
        for link in self.connection.all(f"SELECT source, target FROM links WHERE {clause}source >= ? AND source < ? ORDER BY id", (*params, f"{self.table}:", f"{self.table};")):
            found.setdefault(Ref.parse(link["source"]).id, []).append(Ref.parse(link["target"]))
        return found

    def where(self, **fields) -> list[M]:
        return self.newest(*self.matching(fields))

    def every_where(self, **fields) -> list[M]:
        clause, params = self.matching(fields)
        return self.selected(f"{clause} ORDER BY id", params)

    def newest(self, clause: str, params: tuple) -> list[M]:
        return list(reversed(self.selected(f"{clause} ORDER BY id DESC LIMIT ?", (*params, PAGE))))

    def numbered(self, ids) -> list[M]:
        ids = list(ids)
        if not ids:
            return []
        found = {row.id: row for row in self.selected(f"id IN ({', '.join('?' for _ in ids)})", tuple(ids))}
        return [found[n] for n in ids if n in found]

    def search(self, words: list[str]) -> list[M]:
        clause, params = self.matching_words(words)
        return self.selected(f"{clause} ORDER BY id DESC LIMIT ?", (*params, FOUND))

    def matching_words(self, words: list[str]) -> tuple[str, tuple]:
        each = "(" + " OR ".join(f"{name} LIKE ? ESCAPE '\\'" for name in self.model.text_fields) + ")"
        escaped = [word.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") for word in words]
        return " AND ".join(each for _ in words), tuple(f"%{word}%" for word in escaped for _ in self.model.text_fields)

    def matching(self, fields: dict) -> tuple[str, tuple]:
        return " AND ".join(f"{name} = ?" for name in fields) or "1", tuple(self._column(name).to_sql(value) for name, value in fields.items())

    def page(self, limit: int, before: int | None = None, **fields) -> list[M]:
        where = [f"{name} = ?" for name in fields]
        params = [self._column(name).to_sql(value) for name, value in fields.items()]
        if before is not None:
            where.append("id < ?")
            params.append(before)
        return self.selected(f"{' AND '.join(where) or '1'} ORDER BY id DESC LIMIT ?", (*params, limit))

    def page_in(self, limit: int, before: int | None = None) -> list[M]:
        return self.page(limit, before)

    def save(self, row: M, by: Actor) -> M:
        with self.connection.transaction():
            self.bus.dispatch(Saving(model=row, by=by))
            saved = self._insert(row, by, self._now()) if row.is_new else self._update(row, by)
            self.bus.dispatch(Saved(model=saved, by=by))
            return self.dispatched(saved, by)

    def imported(self, row: M, at: datetime, by: Actor) -> M:
        with self.connection.transaction():
            self.bus.dispatch(Saving(model=row, by=by))
            saved = self._insert(row, by, at)
            self.bus.dispatch(Saved(model=saved, by=by))
            return saved

    def touch(self, row: M, by: Actor, **fields) -> M:
        with self.connection.transaction():
            was = self.find(row.id)
            stamped = was.with_(**fields, updated_at=self._now(), updated_by=by)
            names = [*fields, "updated_at", "updated_by"]
            values = tuple(self._column(name).to_sql(getattr(stamped, name)) for name in names)
            self.connection.execute(f"UPDATE {self.table} SET {', '.join(f'{name} = ?' for name in names)} WHERE id = ?", (*values, stamped.id))
            self.written()
            self.bus.dispatch(Updated(model=stamped, by=by, was=was))
            return stamped

    def rewritten(self, row: M, by: Actor, change: Callable[[M], M]) -> M:
        with self.connection.transaction():
            now = self.find(row.id)
            changed = change(now)
            differing = {f.name: getattr(changed, f.name) for f in fields(changed) if f.metadata.get("column", True) and getattr(changed, f.name) != getattr(now, f.name)}
            return self.dispatched(self.touch(now, by, **differing).with_events(changed.events), by)

    def touched(self, row: M, by: Actor, fields_of: Callable[[M], dict]) -> M:
        with self.connection.transaction():
            now = self.find(row.id)
            return self.touch(now, by, **fields_of(now))

    def delete(self, row: M, by: Actor) -> None:
        with self.connection.transaction():
            self.bus.dispatch(Deleting(model=row, by=by))
            self.connection.execute(f"DELETE FROM {self.table} WHERE id = ?", (row.id,))
            self.written()
            self.bus.dispatch(Deleted(model=row, by=by))
            self.dispatched(row, by)

    def _insert(self, row: M, by: Actor, now: datetime) -> M:
        Title.check_on(row)
        stamped = row.with_(created_at=now, created_by=by, updated_at=now, updated_by=by)
        self.bus.dispatch(Creating(model=stamped, by=by))
        names = [column.name for column in self.columns if column.name != "id"]
        values = tuple(column.to_sql(getattr(stamped, column.name)) for column in self.columns if column.name != "id")
        cursor = self.connection.execute(f"INSERT INTO {self.table} ({', '.join(names)}) VALUES ({', '.join('?' for _ in names)})", values)
        created = stamped.with_(id=cursor.lastrowid)
        self.written()
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
        self.written()
        self.bus.dispatch(Updated(model=stamped, by=by, was=was))
        return stamped

    def dispatched(self, row: M, by: Actor) -> M:
        for event in row.events:
            self.bus.dispatch(event.placed_by(getattr(row, "environment_id", 0), row.created_at.timestamp(), row.id, by.stamp) if isinstance(event, RowEvent) else event)
        return row.without_events()

    def written(self) -> None:
        ...

    def _load(self, row) -> M:
        return self.model(**{column.name: value for column in self.columns if (value := column.from_sql(row[column.name])) is not None})

    def _column(self, name: str) -> Column:
        return next(column for column in self.columns if column.name == name)

    @staticmethod
    def _now() -> datetime:
        return datetime.now(timezone.utc)
