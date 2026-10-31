import json

from core.base.database.database import Database
from core.base.database.migration import Migration
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.model.tables import Tables
from core.base.module.dotted_path import DottedPath
from core.base.module.module import Module
from core.base.module.module_check import ModuleCheck
from core.base.module.module_error import ModuleError
from core.base.module.module_finder import ModuleFinder
from core.base.module.module_sync import ModuleSync

CURSOR_DELETION = Statement("DELETE FROM listener_cursors WHERE listener = ?")
SKIP_DELETION = Statement("DELETE FROM listener_skips WHERE listener = ?")
MIGRATION_RECORD_DELETION = Statement("DELETE FROM migrations WHERE module = ?")


class ModuleRemoval:
    """Takes an installed plugin out of the journal: refused while its tables hold rows unless it ships a
    migration that removes them; its listener cursors, migration records and metadata keys go with it, then
    the rest is synced."""

    def __init__(self, database: Database, home: JournalHome, finder: ModuleFinder, check: ModuleCheck, tables: Tables, sync: ModuleSync) -> None:
        self.database, self.home, self.finder, self.check, self.tables, self.sync = database, home, finder, check, tables, sync

    def remove(self, name: str) -> None:
        listed = self.finder.plugin_paths()
        module_paths = [path for path in listed if self.module(path).name == name]
        if not module_paths:
            raise ModuleError(f"{name} is no installed plugin; the core's default modules cannot be removed")
        module = self.module(module_paths[0])
        removal = self.removal_migration(module)
        if removal is None:
            self.refuse_rows(module)
        remaining_modules = tuple(candidate for candidate in self.finder.found() if candidate is not module)
        with self.database.transaction():
            if removal is not None:
                removal.run(self.database)
            for path in module.listeners:
                listener = self.check.listener(path).name
                self.database.update(Statement(CURSOR_DELETION.sql, (listener,)))
                self.database.update(Statement(SKIP_DELETION.sql, (listener,)))
            self.database.update(Statement(MIGRATION_RECORD_DELETION.sql, (module.name,)))
            for table in (self.tables.table(model).name for model in self.check.models(remaining_modules)):
                self.database.update(Statement(f"UPDATE {table} SET metadata = json_remove(metadata, ?) WHERE json_type(metadata, ?) IS NOT NULL",
                                               (f'$."{module.name}"', f'$."{module.name}"')))
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
            table = self.tables.table(model).name
            count = self.database.rows(Statement(f"SELECT count(*) FROM {table}"))[0][0]
            if count:
                raise ModuleError(f"{module.name} still has {count} rows in {table}: delete them first, or give the module a removal migration")
