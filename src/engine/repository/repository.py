import sqlite3
from collections.abc import Callable, Sequence
from dataclasses import fields, replace
from typing import TypeVar

from engine.change.change import BOOKKEEPING_FIELDS, Change
from engine.change.event_log import EventLog
from engine.command.context import Context
from core.base.database.constraint_refusals import ConstraintRefusals
from core.base.database.database import Database
from core.base.database.table_statements import TableStatements
from engine.guard.guards import Guards
from engine.listener.listeners import Listeners
from engine.listener.event_rows import EventRows
from engine.row.metadata import Metadata
from engine.model.model import Model
from engine.model.table import Table
from engine.model.tables import Tables
from engine.query.queries import Queries
from engine.repository.stale_row_error import StaleRowError
from engine.scope.scopes import Scopes

M = TypeVar("M", bound=Model)

IDENTITY_FIELDS = (*BOOKKEEPING_FIELDS, "creator_id")


class Repository:
    """Saves and deletes rows of any model: works out the change, asks the guards, writes it, logs it and runs
    the listeners, all inside the command's transaction; update saves new values on a row just read, without
    reading it a second time; a change of only the metadata is saved by save_metadata alone."""

    def __init__(self, database: Database, tables: Tables, queries: Queries, guards: Guards, listeners: Listeners, log: EventLog,
                 constraint_refusals: ConstraintRefusals, scopes: Scopes, event_rows: EventRows) -> None:
        self.database, self.tables, self.queries = database, tables, queries
        self.guards, self.listeners, self.log, self.constraint_refusals, self.scopes = guards, listeners, log, constraint_refusals, scopes
        self.event_rows = event_rows

    def save(self, model: M, context: Context) -> M:
        return self.save_change(self.stored(model), model, context)

    def update(self, stored: M, context: Context, **values: object) -> M:
        return self.save_change(stored, stored.changed(**values), context)

    def save_metadata(self, stored: M, metadata: Metadata, context: Context) -> M:
        return self.save_change(stored, replace(stored, metadata=metadata), context, stores_metadata=True)

    def save_change(self, stored: M | None, model: M, context: Context, stores_metadata: bool = False) -> M:
        model = self.scopes.applied(model)
        change = Change(stored, model, context)
        if change.is_empty and not (stores_metadata and change.has_metadata_change) and change.old_row is not None:
            return change.old_row
        skipped = self.guards.ask(change)
        saved = self.persist(model, change)
        self.event_rows.remember(saved)
        saved_change = replace(change, new_row=replace(saved, move=model.move))
        self.log.write(saved_change, skipped)
        self.listeners.run_save_listeners(saved_change)
        return saved

    def merge(self, existing: M | None, model: M, context: Context) -> M:
        if existing is None:
            return self.save(model, context)
        applied = self.scopes.applied(model)
        return self.save_change(existing, replace(existing, **{field.name: getattr(applied, field.name) for field in fields(applied) if field.name not in IDENTITY_FIELDS}), context)

    def delete(self, model: Model, context: Context) -> None:
        self.delete_change(self.stored(model), model, context)

    def delete_stored(self, model: Model, context: Context) -> None:
        self.delete_change(model, model, context)

    def delete_many_stored(self, models: Sequence[Model], context: Context) -> None:
        if not models:
            return
        if any(type(model) is not type(models[0]) for model in models):
            raise ValueError("delete_many_stored needs rows of the same model")
        changes = [Change(model, None, context) for model in models]
        skipped = [self.guards.ask(change) for change in changes]
        self.listeners.run_deletion_listeners_many(changes)
        for model, change, skipped_guards in zip(models, changes, skipped, strict=True):
            self.remove_stored(model, change, skipped_guards)

    def delete_change(self, stored: Model | None, model: Model, context: Context) -> None:
        change: Change[Model] = Change(stored, None, context)
        skipped = self.guards.ask(change)
        self.listeners.run_deletion_listeners(change)
        self.remove_stored(model, change, skipped)

    def remove_stored(self, model: Model, change: Change[Model], skipped: frozenset[str]) -> None:
        table = self.tables.table(type(model))
        deleted_count = self.guarded(lambda: self.database.update(TableStatements(table).delete(model.id, model.version)), table, True)
        if deleted_count == 0:
            raise StaleRowError(model.cli_name, model.id)
        self.event_rows.remove(model)
        self.log.write(change, skipped)
        self.listeners.run_save_listeners(change)

    def stored(self, model: M) -> M | None:
        if not model.is_saved:
            return None
        stored = self.queries.query(type(model)).find(model.id)
        if stored.version != model.version:
            raise StaleRowError(model.cli_name, model.id)
        return stored

    def persist(self, model: M, change: Change[M]) -> M:
        table = self.tables.table(type(model))
        statements = TableStatements(table)
        timestamp = change.context.timestamp
        if change.old_row is None:
            row_id = self.guarded(lambda: self.database.insert(statements.insert(table.row(model, table.columns), timestamp)), table, False)
            return model.saved(row_id, 1, timestamp)
        changed = table.row(model, change.stored_fields)
        updated_count = self.guarded(lambda: self.database.update(statements.update(model.id, model.version, changed, timestamp)), table, False)
        if updated_count == 0:
            raise StaleRowError(model.cli_name, model.id)
        return model.saved(model.id, model.version + 1, timestamp)

    def guarded(self, statement_run: Callable[[], int], table: Table[Model], deletion: bool) -> int:
        try:
            return statement_run()
        except sqlite3.IntegrityError as error:
            raise self.constraint_refusals.refusal(error, table, deletion) from error
