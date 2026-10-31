import sqlite3
from collections.abc import Callable
from dataclasses import fields, replace
from typing import TypeVar

from core.base.change.change import BOOKKEEPING_FIELDS, Change
from core.base.change.event_log import EventLog
from core.base.command.context import Context
from core.base.database.constraint_refusals import ConstraintRefusals
from core.base.database.database import Database
from core.base.database.table_statements import TableStatements
from core.base.guard.guards import Guards
from core.base.listener.listeners import Listeners
from core.base.model.model import Model
from core.base.model.table import Table
from core.base.model.tables import Tables
from core.base.query.queries import Queries
from core.base.repository.stale_row import StaleRow

M = TypeVar("M", bound=Model)

IDENTITY_FIELDS = (*BOOKKEEPING_FIELDS, "creator_id")


class Repository:
    """Saves and deletes rows of any model: works out the change, asks the guards, writes it, logs it and runs
    the listeners, all inside the command's transaction."""

    def __init__(self, database: Database, tables: Tables, queries: Queries, guards: Guards, listeners: Listeners, log: EventLog,
                 constraint_refusals: ConstraintRefusals) -> None:
        self.database, self.tables, self.queries = database, tables, queries
        self.guards, self.listeners, self.log, self.constraint_refusals = guards, listeners, log, constraint_refusals

    def save(self, model: M, context: Context) -> M:
        change = Change(self.stored(model), model, context)
        if change.is_empty and change.old_row is not None:
            return change.old_row
        skipped = self.guards.ask(change)
        saved = self.persist(model, change)
        saved_change = replace(change, new_row=replace(saved, move=model.move))
        self.log.write(saved_change, skipped)
        self.listeners.run_save_listeners(saved_change)
        return saved

    def merge(self, existing: M | None, model: M, context: Context) -> M:
        if existing is None:
            return self.save(model, context)
        return self.save(replace(existing, **{field.name: getattr(model, field.name) for field in fields(model) if field.name not in IDENTITY_FIELDS}), context)

    def delete(self, model: Model, context: Context) -> None:
        stored = self.stored(model)
        change: Change[Model] = Change(stored, None, context)
        skipped = self.guards.ask(change)
        self.listeners.run_deletion_listeners(change)
        table = self.tables.table(type(model))
        self.guarded(lambda: self.database.update(TableStatements(table).delete(model.id, model.version)), table, True)
        self.log.write(change, skipped)
        self.listeners.run_save_listeners(change)

    def stored(self, model: M) -> M | None:
        if not model.is_saved:
            return None
        stored = self.queries.query(type(model)).find(model.id)
        if stored.version != model.version:
            raise StaleRow(model.cli_name, model.id)
        return stored

    def persist(self, model: M, change: Change[M]) -> M:
        table = self.tables.table(type(model))
        statements = TableStatements(table)
        timestamp = change.context.timestamp
        if change.old_row is None:
            row_id = self.guarded(lambda: self.database.insert(statements.insert(table.row(model, table.columns), timestamp)), table, False)
            return model.saved(row_id, 1, timestamp)
        changed = table.row(model, change.fields)
        updated_count = self.guarded(lambda: self.database.update(statements.update(model.id, model.version, changed, timestamp)), table, False)
        if updated_count == 0:
            raise StaleRow(model.cli_name, model.id)
        return model.saved(model.id, model.version + 1, timestamp)

    def guarded(self, statement_run: Callable[[], int], table: Table[Model], deletion: bool) -> int:
        try:
            return statement_run()
        except sqlite3.IntegrityError as error:
            raise self.constraint_refusals.refusal(error, table, deletion) from error
