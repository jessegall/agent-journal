from collections.abc import Sequence
from dataclasses import fields
from engine.time.clock import Clock
from engine.database.database import Database
from engine.database.migration import Migration
from engine.database.rebuild_migration import RebuildMigration
from engine.database.errors.schema_mismatch_error import SchemaMismatchError
from engine.model.view_model import ViewModel
from engine.database.statement import Statement
from engine.model.model import Model
from engine.model.tables import Tables
from engine.database.module_migrations import ModuleMigrations


MIGRATIONS_TABLE = "CREATE TABLE IF NOT EXISTS migrations (module TEXT NOT NULL, number INTEGER NOT NULL, ran_at TEXT NOT NULL, PRIMARY KEY (module, number)) STRICT"
APPLIED_NUMBERS = Statement("SELECT module, number FROM migrations", full_table_reason="One row for each migration the code ships, never for stored journal rows.")
VIEWS = Statement("SELECT name FROM sqlite_master WHERE type = 'view'", scan_reason="Schema maintenance reads SQLite's view catalogue; SQLite does not allow indexing sqlite_master.")
class Schema:
    """Updates the database's tables, views and checks to match the code."""

    def __init__(self, database: Database, tables: Tables, clock: Clock) -> None:
        self.database, self.tables, self.clock = database, tables, clock

    def migrate(self, ordered: Sequence[ModuleMigrations]) -> list[str]:
        self.database.update(Statement(MIGRATIONS_TABLE))
        applied = self.applied_numbers()
        run_names: list[str] = []
        for module in ordered:
            for migration in self.pending(module, applied):
                self.run_one(module.module, migration)
                run_names.append(f"{module.module} {migration.number}")
        return run_names

    def has_pending(self, ordered: Sequence[ModuleMigrations]) -> bool:
        applied = self.applied_numbers()
        return any(self.pending(module, applied) for module in ordered)

    def applied_numbers(self) -> set[tuple[str, int]]:
        return {(row["module"], row["number"]) for row in self.database.rows(APPLIED_NUMBERS)}

    def pending(self, module: ModuleMigrations, applied: set[tuple[str, int]]) -> list[Migration]:
        return [migration for migration in sorted(module.migrations, key=lambda migration: migration.number) if (module.module, migration.number) not in applied]

    def run_one(self, module: str, migration: Migration) -> None:
        record = Statement("INSERT INTO migrations (module, number, ran_at) VALUES (?, ?, ?)", (module, migration.number, self.clock.timestamp().text))
        if isinstance(migration, RebuildMigration):
            self.drop_views()
            migration.run(self.database)
            self.database.insert(record)
            return
        with self.database.transaction():
            migration.run(self.database)
            self.database.insert(record)

    def remove_migration_records(self, module: str) -> None:
        self.database.update(Statement("DELETE FROM migrations WHERE module = ?", [module]))

    def drop_views(self) -> None:
        for row in self.database.rows(VIEWS):
            self.database.update(Statement(f"DROP VIEW {row['name']}"))

    def rebuild_views(self, views: Sequence[type[ViewModel]]) -> None:
        with self.database.transaction():
            self.drop_views()
            for view in views:
                self.database.update(Statement(f"CREATE VIEW {view.view} AS {view.select}"))

    def check_tables(self, models: Sequence[type[Model]], views: Sequence[type[ViewModel]]) -> None:
        differences = (*(difference for model in models for difference in self.differences(model)),
                       *(difference for view in views for difference in self.view_differences(view)))
        if differences:
            raise SchemaMismatchError(differences)

    def view_differences(self, view: type[ViewModel]) -> Sequence[str]:
        stored = [row["name"] for row in self.database.rows(Statement(f"PRAGMA table_info({view.view})"))]
        declared = [field.name for field in fields(view)]
        missing = tuple(f"{view.__name__}.{column} has no column in {view.view}" for column in declared if column not in stored)
        extra = tuple(f"{view.view}.{column} has no field in {view.__name__}" for column in stored if column not in declared)
        return missing + extra

    def differences(self, model: type[Model]) -> Sequence[str]:
        table = self.tables.table(model)
        stored = {row["name"] for row in self.database.rows(Statement(f"PRAGMA table_info({table.name})"))}
        if not stored:
            return [f"{model.__name__} has no table {table.name}"]
        missing = tuple(f"{model.__name__}.{column} has no column in {table.name}" for column in table.columns if column not in stored)
        extra = tuple(f"{table.name}.{column} has no field in {model.__name__}" for column in sorted(stored) if not table.has_column(column))
        return missing + extra
