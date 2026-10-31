from dataclasses import dataclass

from core.base.clock import Clock
from core.base.command.command import Command
from core.base.command.delete_command import DeleteCommand
from core.base.command.edit_command import EditCommand
from core.base.command.handlers.delete_handler import DeleteHandler
from core.base.command.handlers.edit_handler import EditHandler
from core.base.command.handlers.make_handler import MakeHandler
from core.base.command.handlers.move_handler import MoveHandler
from core.base.command.make_command import MakeCommand
from core.base.command.move_command import MoveCommand
from core.base.database.core_tables import CORE_MIGRATIONS
from core.base.database.database import Database
from core.base.database.migration import Migration
from core.base.database.schema import ModuleMigrations, Schema
from core.base.database.triggers import Triggers
from core.base.database.view import View
from core.base.guard.lifecycle_guard import LifecycleGuard
from core.base.listener.commit_listener import CommitListener
from core.base.listener.deletion_listener import DeletionListener
from core.base.database.actor_table import ActorTable
from core.base.database.listener_cursor_table import ListenerCursorTable
from core.base.database.registry_table import RegistryTable
from core.base.listener.save_listener import SaveListener
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.registry.dotted_path import DottedPath
from core.base.change.event_pattern import EventPattern
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.listener_entry import ListenerEntry, ListenerTiming
from core.base.registry.noun_entry import NounEntry
from core.base.registry.registry import Registry
from core.base.module.module import Module
from core.base.module.module_check import ModuleCheck
from core.base.module.module_error import ModuleError
from core.base.module.module_finder import ModuleFinder
from core.base.module.module_order import ModuleOrder


DEFAULT_HANDLERS = {DottedPath.class_path(command).text: DottedPath.class_path(handler)
                    for command, handler in ((MakeCommand, MakeHandler), (EditCommand, EditHandler), (MoveCommand, MoveHandler), (DeleteCommand, DeleteHandler))}


@dataclass(frozen=True)
class SyncReport:
    """What a sync found and changed: the modules in their order, the migrations it ran, and whether the
    registry changed."""

    modules: tuple[str, ...]
    migrations: tuple[str, ...]
    registry_changed: bool

    @property
    def text(self) -> str:
        migrations = ", ".join(self.migrations) if self.migrations else "none"
        registry = "written anew" if self.registry_changed else "unchanged"
        return f"modules: {', '.join(self.modules) or 'none'}\nmigrations run: {migrations}\nregistry: {registry}"


class ModuleSync:
    """Brings the database and the registry in line with the installed modules: finds, orders and checks them,
    runs the schema, gives each module its actor and each new commit listener its cursor, and writes the
    registry."""

    def __init__(self, database: Database, clock: Clock, finder: ModuleFinder, order: ModuleOrder, check: ModuleCheck, schema: Schema,
                 triggers: Triggers, cursors: ListenerCursorTable, actors: ActorTable, registry_table: RegistryTable, fingerprint: CodeFingerprint) -> None:
        self.database, self.clock, self.finder, self.order, self.check = database, clock, finder, order, check
        self.schema, self.triggers, self.cursors, self.fingerprint = schema, triggers, cursors, fingerprint
        self.actors, self.registry_table = actors, registry_table

    def run(self) -> SyncReport:
        modules = self.order.ordered(self.finder.modules())
        self.check.check(modules)
        models = self.check.models(modules)
        migrations = self.schema.migrate((CORE_MIGRATIONS, *(ModuleMigrations(module.name, self.migrations(module)) for module in modules)))
        self.schema.rebuild_views(tuple(self.view(path) for module in modules for path in module.views))
        self.triggers.rebuild(models)
        self.schema.check_tables(models)
        with self.database.transaction():
            moment = self.clock.moment().text
            self.actors.core_actor(moment)
            actor_ids = {module.name: self.actors.module_actor(module.name, moment) for module in modules}
            for module in modules:
                for path in module.listeners:
                    if self.timing(self.check.listener(path)) is ListenerTiming.COMMIT:
                        self.cursors.start(self.check.listener(path).name)
            registry = self.registry(modules, actor_ids)
            registry_changed = self.registry_table.write(registry.fingerprint, registry.entries_text(), moment)
        return SyncReport(tuple(module.name for module in modules), migrations, registry_changed)

    def migrations(self, module: type[Module]) -> tuple[Migration, ...]:
        loaded = tuple(DottedPath(path).loaded() for path in module.migrations)
        return tuple(migration() for migration in loaded if issubclass(migration, Migration))

    def view(self, path: str) -> View:
        value = DottedPath(path).value()
        if not isinstance(value, View):
            raise ModuleError(f"{path} is no view")
        return value

    def registry(self, modules: tuple[type[Module], ...], actor_ids: dict[str, int]) -> Registry:
        guards = [(path, self.check.guard(path)) for module in modules for path in module.guards]
        listeners = [(module, path, self.check.listener(path)) for module in modules for path in module.listeners]
        return Registry(
            fingerprint=self.fingerprint.text(modules),
            nouns={noun.model.cli_noun: NounEntry(module.name, DottedPath.class_path(noun.model), noun.commands, noun.excluded_subcommands) for module in modules for noun in module.nouns},
            handlers={**DEFAULT_HANDLERS, **{DottedPath.class_path(self.command(path)).text: DottedPath(path) for module in modules for path in module.handlers}},
            subcommands={self.check.subcommand_line(path): DottedPath(path) for module in modules for path in module.subcommands},
            guards=(GuardEntry(LifecycleGuard.name, EventPattern(LifecycleGuard.event), DottedPath.class_path(LifecycleGuard), 0, LifecycleGuard.short_flag),
                    *(GuardEntry(guard.name, EventPattern(guard.event), DottedPath(path), position, guard.short_flag)
                      for position, (path, guard) in enumerate(guards, 1))),
            listeners=tuple(ListenerEntry(listener.name, EventPattern(listener.event), self.timing(listener), DottedPath(path), position, actor_ids[module.name])
                            for position, (module, path, listener) in enumerate(listeners, 1)),
            bindings={interface: DottedPath(implementation) for module in modules for interface, implementation in module.bindings},
        )

    def command(self, handler_path: str) -> type[Command[object]]:
        return self.check.handler(handler_path).command

    def timing(self, listener: type[DeletionListener] | type[SaveListener] | type[CommitListener]) -> ListenerTiming:
        if issubclass(listener, DeletionListener):
            return ListenerTiming.DELETION
        if issubclass(listener, SaveListener):
            return ListenerTiming.SAVE
        return ListenerTiming.COMMIT
