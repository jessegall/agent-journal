import json

from core.base.actor import CORE_ACTOR_ID, ActorType
from core.base.clock import Clock
from core.base.command.command import Command
from core.base.database.core_tables import CORE_MIGRATIONS
from core.base.database.database import Database
from core.base.database.migration import Migration
from core.base.database.schema import ModuleMigrations, Schema
from core.base.database.statement import Statement
from core.base.database.triggers import Triggers
from core.base.database.view import View
from core.base.listener.commit_listener import CommitListener
from core.base.listener.deletion_listener import DeletionListener
from core.base.listener.listener_cursors import ListenerCursors
from core.base.listener.save_listener import SaveListener
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.dotted_path import DottedPath
from core.base.module.listener_entry import ListenerTiming
from core.base.module.module import Module
from core.base.module.module_check import ModuleCheck
from core.base.module.module_error import ModuleError
from core.base.module.module_finder import ModuleFinder
from core.base.module.module_order import ModuleOrder

CORE_ACTOR = Statement("INSERT OR IGNORE INTO actors (id, type, name, created_at, updated_at) VALUES (?, ?, 'core', ?, ?)")
MODULE_ACTOR = Statement("INSERT OR IGNORE INTO actors (created_by, type, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
MODULE_ACTOR_ID = Statement("SELECT id FROM actors WHERE type = ? AND name = ?")
REGISTRY_ROW = Statement("SELECT fingerprint, entries FROM registry WHERE id = 1")
REGISTRY_UPSERT = Statement("INSERT INTO registry (id, fingerprint, entries, synced_at) VALUES (1, ?, ?, ?)"
                           " ON CONFLICT (id) DO UPDATE SET fingerprint = excluded.fingerprint, entries = excluded.entries, synced_at = excluded.synced_at")


class ModuleSync:
    """Brings the database and the registry in line with the installed modules: finds, orders and checks them,
    runs the schema, gives each module its actor and each new commit listener its cursor, and writes the
    registry."""

    def __init__(self, database: Database, clock: Clock, finder: ModuleFinder, order: ModuleOrder, check: ModuleCheck, schema: Schema,
                 triggers: Triggers, cursors: ListenerCursors, fingerprint: CodeFingerprint) -> None:
        self.database, self.clock, self.finder, self.order, self.check = database, clock, finder, order, check
        self.schema, self.triggers, self.cursors, self.fingerprint = schema, triggers, cursors, fingerprint

    def run(self) -> None:
        modules = self.order.ordered(self.finder.found())
        self.check.check(modules)
        models = self.check.models(modules)
        self.schema.migrate((CORE_MIGRATIONS, *(ModuleMigrations(module.name, self.migrations(module)) for module in modules)))
        self.schema.rebuild_views(tuple(self.view(path) for module in modules for path in module.views))
        self.triggers.rebuild(models)
        self.schema.check_tables(models)
        with self.database.transaction():
            moment = self.clock.moment().text
            self.database.update(Statement(CORE_ACTOR.sql, (CORE_ACTOR_ID, ActorType.CORE.value, moment, moment)))
            actor_ids = {module.name: self.module_actor(module, moment) for module in modules}
            for module in modules:
                for path in module.listeners:
                    if self.timing(self.check.listener(path)) is ListenerTiming.COMMIT:
                        self.cursors.start(self.check.listener(path).name)
            entries = self.entries(modules, actor_ids)
            self.write_registry(self.fingerprint.text(modules), json.dumps(entries, sort_keys=True), moment)

    def migrations(self, module: type[Module]) -> tuple[Migration, ...]:
        loaded = tuple(DottedPath(path).loaded() for path in module.migrations)
        return tuple(migration() for migration in loaded if issubclass(migration, Migration))

    def view(self, path: str) -> View:
        value = DottedPath(path).value()
        if not isinstance(value, View):
            raise ModuleError(f"{path} is no view")
        return value

    def module_actor(self, module: type[Module], moment: str) -> int:
        self.database.update(Statement(MODULE_ACTOR.sql, (CORE_ACTOR_ID, ActorType.MODULE.value, module.name, moment, moment)))
        return self.database.rows(Statement(MODULE_ACTOR_ID.sql, (ActorType.MODULE.value, module.name)))[0]["id"]

    def entries(self, modules: tuple[type[Module], ...], actor_ids: dict[str, int]) -> dict[str, object]:
        guards = [(module, path, self.check.guard(path)) for module in modules for path in module.guards]
        listeners = [(module, path, self.check.listener(path)) for module in modules for path in module.listeners]
        return {
            "nouns": {noun.model.name: module.name for module in modules for noun in module.nouns},
            "handlers": {DottedPath.class_path(self.command(path)).text: path for module in modules for path in module.handlers},
            "subcommands": {},
            "guards": [{"name": guard.name, "event": guard.event, "path": path, "position": position, "short_flag": guard.short_flag}
                       for position, (_, path, guard) in enumerate(guards, 1)],
            "listeners": [{"name": listener.name, "event": listener.event, "timing": self.timing(listener).value, "path": path, "position": position,
                           "actor_id": actor_ids[module.name]} for position, (module, path, listener) in enumerate(listeners, 1)],
        }

    def command(self, handler_path: str) -> type[Command[object]]:
        return self.check.handler(handler_path).command

    def timing(self, listener: type[DeletionListener] | type[SaveListener] | type[CommitListener]) -> ListenerTiming:
        if issubclass(listener, DeletionListener):
            return ListenerTiming.DELETION
        if issubclass(listener, SaveListener):
            return ListenerTiming.SAVE
        return ListenerTiming.COMMIT

    def write_registry(self, fingerprint: str, entries: str, moment: str) -> None:
        rows = self.database.rows(REGISTRY_ROW)
        if rows and (rows[0]["fingerprint"], rows[0]["entries"]) == (fingerprint, entries):
            return
        self.database.update(Statement(REGISTRY_UPSERT.sql, (fingerprint, entries, moment)))
