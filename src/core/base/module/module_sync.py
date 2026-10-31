from dataclasses import dataclass

from core.base.clock import Clock
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
from core.base.guard.lifecycle_guard import LifecycleGuard
from core.base.listener.deletion_listener import DeletionListener
from core.base.database.actor_table import ActorTable
from core.base.database.listener_cursor_table import ListenerCursorTable
from core.base.database.registry_table import RegistryTable
from core.base.listener.save_listener import SaveListener
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.registry.dotted_path import DottedPath
from core.base.change.event_pattern import EventPattern
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.listener_entry import ListenerEntry
from core.base.registry.listener_timing import ListenerTiming
from core.base.registry.model_entry import ModelEntry
from core.base.registry.registry import Registry
from core.base.module.module import ListenerClass, Module
from core.base.module.driver_entries import DriverEntries
from core.base.registry.driver_rule_entry import DriverRuleEntry
from core.base.module.module_check import ModuleCheck, subcommand_line
from core.base.module.module_finder import ModuleFinder
from core.base.module.module_order import ModuleOrder


DEFAULT_HANDLERS = {DottedPath.class_path(command).text: DottedPath.class_path(handler)
                    for command, handler in ((MakeCommand, MakeHandler), (EditCommand, EditHandler), (MoveCommand, MoveHandler), (DeleteCommand, DeleteHandler))}


@dataclass(frozen=True)
class SyncReport:
    """What a sync found and changed: the modules in their order, the migrations it ran, and whether the
    registry changed."""

    modules: tuple[str, ...]
    migrations: list[str]
    registry_changed: bool

    @property
    def text(self) -> str:
        migrations = ", ".join(self.migrations) if self.migrations else "none"
        registry = "rewritten" if self.registry_changed else "unchanged"
        return f"modules: {', '.join(self.modules) or 'none'}\nmigrations run: {migrations}\nregistry: {registry}"


class ModuleSync:
    """Updates the database and the registry to match the installed modules: finds, orders and checks them,
    runs the schema, gives each module its actor and each new commit listener its cursor, and writes the
    registry."""

    def __init__(self, database: Database, clock: Clock, finder: ModuleFinder, order: ModuleOrder, check: ModuleCheck, schema: Schema,
                 triggers: Triggers, cursors: ListenerCursorTable, actors: ActorTable, registry_table: RegistryTable, fingerprint: CodeFingerprint,
                 entries: DriverEntries) -> None:
        self.database, self.clock, self.finder, self.order, self.check = database, clock, finder, order, check
        self.schema, self.triggers, self.cursors, self.fingerprint = schema, triggers, cursors, fingerprint
        self.actors, self.registry_table, self.entries = actors, registry_table, entries

    def run(self) -> SyncReport:
        modules = self.order.ordered(self.finder.modules())
        rules = self.entries.rules(modules)
        self.check.check(modules, rules)
        models = self.check.models(modules)
        migrations = self.schema.migrate((CORE_MIGRATIONS, *(ModuleMigrations(module.name, self.migrations(module)) for module in modules)))
        self.schema.rebuild_views(tuple(view for module in modules for view in module.views))
        self.triggers.rebuild(models)
        self.schema.check_tables(models)
        with self.database.transaction():
            timestamp = self.clock.timestamp().text
            self.actors.core_actor(timestamp)
            actor_ids = {module.name: self.actors.module_actor(module.name, timestamp) for module in modules}
            for module in modules:
                for listener in module.listeners:
                    if self.timing(listener) is ListenerTiming.COMMIT:
                        self.cursors.start(listener.name)
            registry = self.registry(modules, rules, actor_ids)
            registry_changed = self.registry_table.write(registry.fingerprint, registry.entries_text(), timestamp)
        return SyncReport(tuple(module.name for module in modules), migrations, registry_changed)

    def migrations(self, module: type[Module]) -> tuple[Migration, ...]:
        return tuple(migration() for migration in module.migrations)

    def registry(self, modules: tuple[type[Module], ...], rules: tuple[DriverRuleEntry, ...], actor_ids: dict[str, int]) -> Registry:
        guards = [guard for module in modules for guard in module.guards]
        listeners = [(module, listener) for module in modules for listener in module.listeners]
        return Registry(
            fingerprint=self.fingerprint.text(modules),
            models={declaration.model.cli_name: ModelEntry(module.name, DottedPath.class_path(declaration.model), tuple(DottedPath.class_path(command).text for command in declaration.commands),
                                                  declaration.excluded_subcommands) for module in modules for declaration in module.models},
            handlers={**DEFAULT_HANDLERS, **{DottedPath.class_path(handler.command).text: DottedPath.class_path(handler) for module in modules for handler in module.handlers}},
            subcommands={subcommand_line(subcommand): DottedPath.class_path(subcommand) for module in modules for subcommand in module.subcommands},
            guards=(GuardEntry(LifecycleGuard.name, EventPattern(LifecycleGuard.event), DottedPath.class_path(LifecycleGuard), 0, LifecycleGuard.short_flag),
                    *(GuardEntry(guard.name, EventPattern(guard.event), DottedPath.class_path(guard), position, guard.short_flag)
                      for position, guard in enumerate(guards, 1))),
            listeners=tuple(ListenerEntry(listener.name, EventPattern(listener.event), self.timing(listener), DottedPath.class_path(listener), position,
                                          actor_ids[module.name]) for position, (module, listener) in enumerate(listeners, 1)),
            bindings={DottedPath.class_path(interface).text: DottedPath.class_path(implementation) for module in modules for interface, implementation in module.bindings},
            overlays=self.entries.overlays(modules),
            rules=rules,
            suites=self.entries.suites(modules),
            drivers=self.entries.drivers(modules),
        )

    def timing(self, listener: ListenerClass) -> ListenerTiming:
        if issubclass(listener, DeletionListener):
            return ListenerTiming.DELETION
        if issubclass(listener, SaveListener):
            return ListenerTiming.SAVE
        return ListenerTiming.COMMIT
