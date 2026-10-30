from dataclasses import dataclass
from datetime import datetime, timezone

from core.base.database.database import Database
from core.base.database.migration import Migration
from core.base.database.rebuild_migration import RebuildMigration
from core.base.database.schema_mismatch import SchemaMismatch
from core.base.database.statement import Statement
from core.base.database.view import View
from core.base.model.model import Model
from core.base.model.tables import Tables

MIGRATIONS_TABLE = "CREATE TABLE IF NOT EXISTS migrations (module TEXT NOT NULL, number INTEGER NOT NULL, ran_at TEXT NOT NULL, PRIMARY KEY (module, number)) STRICT"
LAST_NUMBERS = Statement("SELECT module, max(number) AS number FROM migrations GROUP BY module")
VIEWS = Statement("SELECT name FROM sqlite_master WHERE type = 'view'")


@dataclass(frozen=True)
class ModuleMigrations:
    """One module's migrations, in the order the modules depend on one another."""

    module: str
    migrations: tuple[Migration, ...]


class Schema:
    """All the work on the database's shape: each module's migrations not yet run, by module and number, in the
    order of the modules' dependencies."""

    def __init__(self, database: Database, tables: Tables) -> None:
        self.database, self.tables = database, tables

    def migrate(self, ordered: tuple[ModuleMigrations, ...]) -> tuple[str, ...]:
        self.database.update(Statement(MIGRATIONS_TABLE))
        highest_numbers = {row["module"]: row["number"] for row in self.database.rows(LAST_NUMBERS)}
        run_names = []
        for module in ordered:
            pending = [migration for migration in sorted(module.migrations, key=lambda migration: migration.number) if migration.number > highest_numbers.get(module.module, 0)]
            for migration in pending:
                self.run_one(module.module, migration)
                run_names.append(f"{module.module} {migration.number}")
        return tuple(run_names)

    def run_one(self, module: str, migration: Migration) -> None:
        record = Statement("INSERT INTO migrations (module, number, ran_at) VALUES (?, ?, ?)", (module, migration.number, datetime.now(timezone.utc).isoformat()))
        if isinstance(migration, RebuildMigration):
            self.drop_views()
            migration.run(self.database)
            self.database.insert(record)
            return
        with self.database.transaction():
            migration.run(self.database)
            self.database.insert(record)

    def drop_views(self) -> None:
        for row in self.database.rows(VIEWS):
            self.database.update(Statement(f"DROP VIEW {row['name']}"))

    def rebuild_views(self, views: tuple[View, ...]) -> None:
        with self.database.transaction():
            self.drop_views()
            for view in views:
                self.database.update(Statement(f"CREATE VIEW {view.name} AS {view.select}"))

    def check_tables(self, models: tuple[type[Model], ...]) -> None:
        differences = tuple(difference for model in models for difference in self.differences(model))
        if differences:
            raise SchemaMismatch(differences)

    def differences(self, model: type[Model]) -> tuple[str, ...]:
        table = self.tables.table(model)
        stored = {row["name"] for row in self.database.rows(Statement(f"PRAGMA table_info({table.name})"))}
        if not stored:
            return (f"{model.__name__} has no table {table.name}",)
        missing = tuple(f"{model.__name__}.{column} has no column in {table.name}" for column in table.columns if column not in stored)
        extra = tuple(f"{table.name}.{column} has no field in {model.__name__}" for column in sorted(stored) if not table.has_column(column))
        return missing + extra
