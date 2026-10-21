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
from journal.support.missing_row import MissingRow

M = TypeVar("M", bound=Model)


PAGE = 500
MATCH_LIMIT = 40


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
            raise MissingRow(self.table, id)
        return self._load(row)

    def all(self) -> list[M]:
        return self.newest("1", ())

    def rows(self) -> list[M]:
        return self.selected("1 ORDER BY id")

    def selected(self, clause: str, params: tuple = ()) -> list[M]:
        return [self._load(row) for row in self.connection.all(f"SELECT * FROM {self.table} WHERE {clause}", params)]

    def linked(self, kind: str) -> dict[int, list[Ref]]:
        return self._linked("kind = ? AND ", (kind,))

    def linked_rows(self) -> dict[int, list[Ref]]:
        return self._linked("", ())

    def _linked(self, clause: str, params: tuple) -> dict[int, list[Ref]]:
        rows: dict[int, list[Ref]] = {}
        for link in self.connection.all(f"SELECT source, target FROM links WHERE {clause}source >= ? AND source < ? ORDER BY id", (*params, f"{self.table}:", f"{self.table};")):
            rows.setdefault(Ref.parse(link["source"]).id, []).append(Ref.parse(link["target"]))
        return rows

    def matching(self, **fields) -> list[M]:
        return self.newest(*self.clause(fields))

    def all_matching(self, **fields) -> list[M]:
        clause, params = self.clause(fields)
        return self.selected(f"{clause} ORDER BY id", params)

    def newest(self, clause: str, params: tuple) -> list[M]:
        return list(reversed(self.selected(f"{clause} ORDER BY id DESC LIMIT ?", (*params, PAGE))))

    def numbered(self, ids) -> list[M]:
        ids = list(ids)
        if not ids:
            return []
        rows = {row.id: row for row in self.selected(f"id IN ({', '.join('?' for _ in ids)})", tuple(ids))}
        return [rows[n] for n in ids if n in rows]

    def search(self, terms: list[str]) -> list[M]:
        clause, params = self.matching_words(terms)
        return self.selected(f"{clause} ORDER BY id DESC LIMIT ?", (*params, MATCH_LIMIT))

    def matching_words(self, terms: list[str]) -> tuple[str, tuple]:
        each = "(" + " OR ".join(f"{name} LIKE ? ESCAPE '\\'" for name in self.model.text_fields) + ")"
        escaped = [word.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") for word in terms]
        return " AND ".join(each for _ in terms), tuple(f"%{word}%" for word in escaped for _ in self.model.text_fields)

    def clause(self, fields: dict) -> tuple[str, tuple]:
        return " AND ".join(f"{name} = ?" for name in fields) or "1", tuple(self._column(name).to_sql(value) for name, value in fields.items())

    def page(self, limit: int, before: int | None = None, **fields) -> list[M]:
        clauses = [f"{name} = ?" for name in fields]
        params = [self._column(name).to_sql(value) for name, value in fields.items()]
        if before is not None:
            clauses.append("id < ?")
            params.append(before)
        return self.selected(f"{' AND '.join(clauses) or '1'} ORDER BY id DESC LIMIT ?", (*params, limit))

    def page_in(self, limit: int, before: int | None = None) -> list[M]:
        return self.page(limit, before)

    def save(self, row: M, actor: Actor) -> M:
        with self.connection.transaction():
            self.bus.dispatch(Saving(model=row, actor=actor))
            saved = self._insert(row, actor, self._time()) if row.is_new else self._update(row, actor)
            self.bus.dispatch(Saved(model=saved, actor=actor))
            return self.dispatched(saved, actor)

    def imported(self, row: M, time: datetime, actor: Actor) -> M:
        with self.connection.transaction():
            self.bus.dispatch(Saving(model=row, actor=actor))
            saved = self._insert(row, actor, time)
            self.bus.dispatch(Saved(model=saved, actor=actor))
            return saved

    def touch(self, row: M, actor: Actor, **fields) -> M:
        with self.connection.transaction():
            was = self.find(row.id)
            stamped = was.with_(**fields, updated_at=self._time(), updated_by=actor)
            names = [*fields, "updated_at", "updated_by"]
            values = tuple(self._column(name).to_sql(getattr(stamped, name)) for name in names)
            self.connection.execute(f"UPDATE {self.table} SET {', '.join(f'{name} = ?' for name in names)} WHERE id = ?", (*values, stamped.id))
            self.written()
            self.bus.dispatch(Updated(model=stamped, actor=actor, was=was))
            return stamped

    def rewritten(self, row: M, actor: Actor, change: Callable[[M], M]) -> M:
        with self.connection.transaction():
            time = self.find(row.id)
            changed = change(time)
            differing = {f.name: getattr(changed, f.name) for f in fields(changed) if f.metadata.get("column", True) and getattr(changed, f.name) != getattr(time, f.name)}
            return self.dispatched(self.touch(time, actor, **differing).with_events(changed.events), actor)

    def touched(self, row: M, actor: Actor, fields_of: Callable[[M], dict]) -> M:
        with self.connection.transaction():
            time = self.find(row.id)
            return self.touch(time, actor, **fields_of(time))

    def delete(self, row: M, actor: Actor) -> None:
        with self.connection.transaction():
            self.bus.dispatch(Deleting(model=row, actor=actor))
            self.connection.execute(f"DELETE FROM {self.table} WHERE id = ?", (row.id,))
            self.written()
            self.bus.dispatch(Deleted(model=row, actor=actor))
            self.dispatched(row, actor)

    def _insert(self, row: M, actor: Actor, time: datetime) -> M:
        Title.check_target(row)
        stamped = row.with_(created_at=time, created_by=actor, updated_at=time, updated_by=actor)
        self.bus.dispatch(Creating(model=stamped, actor=actor))
        names = [column.name for column in self.columns if column.name != "id"]
        values = tuple(column.to_sql(getattr(stamped, column.name)) for column in self.columns if column.name != "id")
        cursor = self.connection.execute(f"INSERT INTO {self.table} ({', '.join(names)}) VALUES ({', '.join('?' for _ in names)})", values)
        created = stamped.with_(id=cursor.lastrowid)
        self.written()
        self.bus.dispatch(Created(model=created, actor=actor))
        return created

    def _update(self, row: M, actor: Actor) -> M:
        stamped = row.with_(updated_at=self._time(), updated_by=actor)
        was = self.find(row.id)
        Title.check_target(row, was)
        self.bus.dispatch(Updating(model=stamped, actor=actor))
        names = [column.name for column in self.columns if column.name != "id"]
        values = tuple(column.to_sql(getattr(stamped, column.name)) for column in self.columns if column.name != "id")
        self.connection.execute(f"UPDATE {self.table} SET {', '.join(f'{name} = ?' for name in names)} WHERE id = ?", (*values, stamped.id))
        self.written()
        self.bus.dispatch(Updated(model=stamped, actor=actor, was=was))
        return stamped

    def dispatched(self, row: M, actor: Actor) -> M:
        for event in row.events:
            self.bus.dispatch(event.placed_by(getattr(row, "environment_id", 0), row.created_at.timestamp(), row.id, actor.stamp) if isinstance(event, RowEvent) else event)
        return row.without_events()

    def written(self) -> None:
        ...

    def _load(self, row) -> M:
        return self.model(**{column.name: value for column in self.columns if (value := column.parsed(row[column.name])) is not None})

    def _column(self, name: str) -> Column:
        return next(column for column in self.columns if column.name == name)

    @staticmethod
    def _time() -> datetime:
        return datetime.now(timezone.utc)
