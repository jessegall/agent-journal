from dataclasses import fields
from typing import get_type_hints

from journal.db.column import Column
from journal.db.connection import Connection
from journal.models.model import Model


class Schema:
    """Creates a table per model from its fields, and the table that records which migrations ran."""

    def __init__(self, connection: Connection, models: tuple[type[Model], ...]) -> None:
        self.connection, self.models = connection, models

    def create(self) -> None:
        with self.connection.transaction() as db:
            db.execute("CREATE TABLE IF NOT EXISTS migrations (number INTEGER PRIMARY KEY, ran_at TEXT NOT NULL)")
            for model in self.models:
                db.execute(self.statement(model))
                self.add_new_columns(db, model)

    def add_new_columns(self, db, model: type[Model]) -> None:
        """A column a model gained after its table was made is added to the table; nothing is ever dropped."""
        present = {row["name"] for row in db.execute(f"PRAGMA table_info({model.table()})").fetchall()}
        for column in self.columns(model):
            if column.name not in present:
                db.execute(f"ALTER TABLE {model.table()} ADD COLUMN {column.name} {column.sql_type}")

    def statement(self, model: type[Model]) -> str:
        columns = ", ".join(f"{column.name} {column.sql_type}" for column in self.columns(model) if column.name != "id")
        return f"CREATE TABLE IF NOT EXISTS {model.table()} (id INTEGER PRIMARY KEY AUTOINCREMENT, {columns})"

    @staticmethod
    def columns(model: type[Model]) -> tuple[Column, ...]:
        hints = get_type_hints(model)
        return tuple(Column.of(field.name, hints[field.name]) for field in fields(model))

    def version(self) -> int:
        row = self.connection.one("SELECT MAX(number) AS number FROM migrations")
        return row["number"] or 0
