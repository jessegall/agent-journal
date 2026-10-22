from dataclasses import fields
from datetime import datetime, timezone
from typing import Callable, Generic, TypeVar

from journal.models.support.column import Column
from journal.repositories.load_tally import LoadTally
from journal.db.connection import Connection
from journal.db.query import Query
from journal.db.schema import Schema
from journal.events.models.created import Created
from journal.events.models.creating import Creating
from journal.events.models.deleted import Deleted
from journal.events.models.deleting import Deleting
from journal.events.models.number_request import NumberRequest
from journal.events.models.purged import Purged
from journal.events.models.synced_creation import SyncedCreation
from journal.events.models.synced_deletion import SyncedDeletion
from journal.events.models.synced_update import SyncedUpdate
from journal.events.models.saved import Saved
from journal.events.models.saving import Saving
from journal.events.models.updated import Updated
from journal.events.rows.row_event import RowEvent
from journal.events.models.updating import Updating
from journal.events.bus import Bus
from journal.support.actor import Actor
from journal.models.link import Link
from journal.models.model import Model
from journal.models.support.ref import Ref
from journal.support.title import Title
from journal.support.missing_row import MissingRow

M = TypeVar("M", bound=Model)


PAGE_ROWS = 500
MATCH_ROWS = 40


class Repository(Generic[M]):
    """Reads and writes one model's table. Every write names its actor, stamps the row with it, and tells the bus at each step: saving, creating or updating, created or updated, saved; deleting, deleted."""

    model: type[M]

    def __init__(self, connection: Connection, bus: Bus) -> None:
        self.connection, self.bus = connection, bus
        self.columns: tuple[Column, ...] = Schema.columns(self.model)
        self.column_map = {column.name: column for column in self.columns}
        self.table = self.model.table()
        self.link_query = Query.build(Link)

    def query(self) -> Query:
        return Query(self.table, self.column_map)

    def find(self, id: int) -> M:
        rows = self._loaded(self.query().filter(id=id))
        if not rows:
            raise MissingRow(self.table, id)
        return rows[0]

    def all(self) -> list[M]:
        return self.newest(self.query())

    def rows(self) -> list[M]:
        return self.selected(self.query().order("id"))

    def selected(self, query: Query) -> list[M]:
        return self._loaded(query)

    def _purged(self, query: Query) -> None:
        self.connection.execute(*query.delete())

    def purged_rows(self, model: type[Model], query: Query, actor: Actor) -> None:
        ids = tuple(row["id"] for row in self.connection.all(*query.select()))
        self._purged(query)
        self.bus.dispatch(Purged(model=model, ids=ids, actor=actor))

    def linked(self, kind: str) -> dict[int, list[Ref]]:
        return self._linked(self.link_query.filter(kind=kind))

    def linked_rows(self) -> dict[int, list[Ref]]:
        return self._linked(self.link_query)

    def _linked(self, query: Query) -> dict[int, list[Ref]]:
        rows: dict[int, list[Ref]] = {}
        for link in self.connection.all(*query.filter_prefix("source", f"{self.table}:").order("id").select()):
            targets = rows.setdefault(Ref.parse(link["source"]).id, [])
            if (target := Ref.parse(link["target"])) not in targets:
                targets.append(target)
        return rows

    def matching(self, **fields) -> list[M]:
        return self.newest(self.query().filter(**fields))

    def single(self, **fields) -> M:
        rows = self.matching(**fields)
        if not rows:
            raise MissingRow(self.table, ", ".join(map(str, fields.values())))
        return rows[0]

    def all_matching(self, **fields) -> list[M]:
        return self.selected(self.query().filter(**fields).order("id"))

    def newest(self, query: Query) -> list[M]:
        return list(reversed(self.selected(query.order_descending("id").limit(PAGE_ROWS))))

    def numbered(self, ids) -> list[M]:
        ids = list(ids)
        if not ids:
            return []
        rows = {row.id: row for row in self.selected(self.query().filter_listed("id", ids))}
        return [rows[n] for n in ids if n in rows]

    def search(self, terms: list[str]) -> list[M]:
        return self.search_rows(self.query(), terms)

    def search_rows(self, query: Query, terms: list[str]) -> list[M]:
        for word in terms:
            query = query.filter_alternatives(*(self.query().filter_containing(name, word) for name in self.model.text_fields))
        return self.selected(query.order_descending("id").limit(MATCH_ROWS))

    def page(self, limit: int, previous: int | None = None, **fields) -> list[M]:
        query = self.query().filter(**fields)
        if previous is not None:
            query = query.filter_less("id", previous)
        return self.selected(query.order_descending("id").limit(limit))

    def scoped_page(self, limit: int, previous: int | None = None) -> list[M]:
        return self.page(limit, previous)

    def save(self, row: M, actor: Actor) -> M:
        with self.connection.transaction():
            self.bus.dispatch(Saving(model=row, actor=actor))
            saved = self._insert(row.with_events((*row.events, *row.creation_events())), actor, self._time()) if row.is_new else self._update(row, actor)
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
            prior_row = self.find(row.row_id)
            stamped = prior_row.with_(**fields, updated_at=self._time(), updater=actor)
            self.connection.execute(*self.query().filter(id=stamped.id).update(**{name: getattr(stamped, name) for name in (*fields, "updated_at", "updater")}))
            self.stored()
            self.bus.dispatch(Updated(model=stamped, actor=actor, previous=prior_row))
            return stamped

    def rewritten(self, row: M, actor: Actor, change: Callable[[M], M]) -> M:
        with self.connection.transaction():
            time = self.find(row.row_id)
            changed = change(time)
            differing = {f.name: getattr(changed, f.name) for f in fields(changed) if f.metadata.get("column", True) and getattr(changed, f.name) != getattr(time, f.name)}
            return self.dispatched(self.touch(time, actor, **differing).with_events(changed.events), actor)

    def touched(self, row: M, actor: Actor, field_map: Callable[[M], dict]) -> M:
        with self.connection.transaction():
            time = self.find(row.row_id)
            return self.touch(time, actor, **field_map(time))

    def delete(self, row: M, actor: Actor) -> None:
        with self.connection.transaction():
            self.bus.dispatch(Deleting(model=row, actor=actor))
            self._purged(self.query().filter(id=row.id))
            self.stored()
            self.bus.dispatch(Deleted(model=row, actor=actor))
            self.dispatched(row, actor)

    def pulled_creation(self, id: int, fields: dict, actor: Actor) -> M:
        row = self.model(**{**self._parsed(fields), "id": id, "updated_at": self._time()})
        with self.connection.transaction():
            self.connection.execute(*self.query().upsert(id=id, **self._column_values(row)))
            self.stored()
            self.bus.dispatch(SyncedCreation(model=row, actor=actor))
            return self.dispatched(row.with_events(row.creation_events()), actor)

    def pulled_update(self, id: int, fields: dict, actor: Actor) -> list[M]:
        with self.connection.transaction():
            parsed = self._parsed(fields)
            if parsed:
                self.connection.execute(*self.query().filter(id=id).update(**{**parsed, "updated_at": self._time()}))
            self.stored()
            rows = self._loaded(self.query().filter(id=id))
            for row in rows:
                self.bus.dispatch(SyncedUpdate(model=row, actor=actor))
            return rows

    def pulled_deletion(self, id: int, actor: Actor) -> list[M]:
        with self.connection.transaction():
            rows = self._loaded(self.query().filter(id=id))
            self._purged(self.query().filter(id=id))
            self.stored()
            for row in rows:
                self.bus.dispatch(SyncedDeletion(model=row, actor=actor))
            return rows

    def _parsed(self, fields: dict) -> dict:
        return {name: self.column_map[name].parsed(value) for name, value in fields.items() if name in self.column_map and name != "id"}

    def remove(self, id: int, actor: Actor) -> None:
        self.delete(self.find(id), actor)

    def _insert(self, row: M, actor: Actor, time: datetime) -> M:
        Title.check_target(row)
        stamped = row.with_(created_at=time, creator=actor, updated_at=time, updater=actor)
        self.bus.dispatch(Creating(model=stamped, actor=actor))
        number = self._number(stamped)
        values = {"id": number, **self._column_values(stamped)} if number else self._column_values(stamped)
        cursor = self.connection.execute(*self.query().insert(**values))
        created = stamped.with_(id=cursor.lastrowid)
        self.stored()
        self.bus.dispatch(Created(model=created, actor=actor))
        return created

    def _number(self, row: M) -> int:
        return next((answer for answer in self.bus.dispatch(NumberRequest(model=row)) if answer), 0)

    def _update(self, row: M, actor: Actor) -> M:
        stamped = row.with_(updated_at=self._time(), updater=actor)
        prior_row = self.find(row.row_id)
        Title.check_target(row, prior_row)
        self.bus.dispatch(Updating(model=stamped, actor=actor))
        self.connection.execute(*self.query().filter(id=stamped.id).update(**self._column_values(stamped)))
        self.stored()
        self.bus.dispatch(Updated(model=stamped, actor=actor, previous=prior_row))
        return stamped

    def dispatched(self, row: M, actor: Actor) -> M:
        for event in row.events:
            self.bus.dispatch(event.placed(getattr(row, "environment_id", 0), row.creation_time.timestamp(), row.row_id, actor.stamp) if isinstance(event, RowEvent) else event)
        return row.without_events()

    def stored(self) -> None:
        ...

    def _loaded(self, query: Query) -> list[M]:
        return [self._load(row) for row in self.connection.all(*query.select())]

    def _column_values(self, row: M) -> dict:
        return {column.name: getattr(row, column.name) for column in self.columns if column.name != "id"}

    def _load(self, row) -> M:
        LoadTally.counted(self.table)
        return self.model(**{column.name: value for column in self.columns if (value := column.parsed(row[column.name])) is not None})

    @staticmethod
    def _time() -> datetime:
        return datetime.now(timezone.utc)
