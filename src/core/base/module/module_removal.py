import json

from core.base.database.database import Database
from core.base.database.migration import Migration
from core.base.database.listener_cursor_table import ListenerCursorTable
from core.base.database.schema import Schema
from core.base.database.table_statements import TableStatements
from core.base.journal_home import JournalHome
from core.base.model.tables import Tables
from core.base.registry.dotted_path import DottedPath
from core.base.module.module import Module
from core.base.module.module_check import ModuleCheck
from core.base.module.module_error import ModuleError
from core.base.module.module_finder import ModuleFinder
from core.base.module.module_sync import ModuleSync



class ModuleRemoval:
    """Takes an installed plugin out of the journal: refused while its tables hold rows unless it ships a
    migration that removes them; its listener cursors, migration records and metadata keys go with it, then
    the rest is synced."""

    def __init__(self, database: Database, home: JournalHome, finder: ModuleFinder, check: ModuleCheck, tables: Tables, sync: ModuleSync,
                 cursors: ListenerCursorTable, schema: Schema) -> None:
        self.database, self.home, self.finder, self.check, self.tables, self.sync = database, home, finder, check, tables, sync
        self.cursors, self.schema = cursors, schema

    def remove(self, name: str) -> None:
        listed = self.finder.plugin_paths()
        module_paths = [path for path in listed if self.module(path).name == name]
        if not module_paths:
            raise ModuleError(f"{name} is no installed plugin; the core's default modules cannot be removed")
        module = self.module(module_paths[0])
        removal = self.removal_migration(module)
        if removal is None:
            self.refuse_rows(module)
        remaining_modules = tuple(candidate for candidate in self.finder.modules() if candidate is not module)
        with self.database.transaction():
            if removal is not None:
                removal.run(self.database)
            for path in module.listeners:
                self.cursors.remove(self.check.listener(path).name)
            self.schema.remove_migration_records(module.name)
            for model in self.check.models(remaining_modules):
                self.database.update(TableStatements(self.tables.table(model)).metadata_removal(module.name))
        self.home.module_list.write_text(json.dumps([path for path in listed if path != module_paths[0]]))
        self.sync.run()

    def module(self, path: str) -> type[Module]:
        return self.finder.checked(DottedPath(path))

    def removal_migration(self, module: type[Module]) -> Migration | None:
        if not module.removal:
            return None
        loaded = DottedPath(module.removal).loaded()
        if not issubclass(loaded, Migration):
            raise ModuleError(f"{module.removal} is no migration")
        return loaded()

    def refuse_rows(self, module: type[Module]) -> None:
        for model in self.check.models((module,)):
            table = self.tables.table(model)
            count = self.database.rows(TableStatements(table).count())[0][0]
            if count:
                raise ModuleError(f"{module.name} still has {count} rows in {table.name}: delete them first, or give the module a removal migration")
