from core.base.clock import Clock
from core.base.command.delete_command import DeleteCommand
from core.base.command.edit_command import EditCommand
from core.base.command.handlers.delete_handler import DeleteHandler
from core.base.command.handlers.edit_handler import EditHandler
from core.base.command.handlers.make_handler import MakeHandler
from core.base.command.handlers.move_handler import MoveHandler
from core.base.command.make_command import MakeCommand
from core.base.command.move_command import MoveCommand
from core.base.database.core_tables_migration import CORE_MIGRATIONS
from core.base.actor import CORE_ACTOR_ID
from core.base.change.event_log import EventLog
from core.base.database.database import Database
from core.base.database.migration import Migration
from core.base.database.schema import Schema
from core.base.database.module_migrations import ModuleMigrations
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
from core.base.registry.dock_entry import DockEntry
from core.base.registry.mark_entry import MarkEntry
from core.base.registry.window_entry import WindowEntry
from core.base.module.window_check import unavailable_reason
from core.base.module.module import ListenerClass, Module
from core.base.module.driver_entries import DriverEntries
from core.base.module.provider_entries import ProviderEntries
from core.base.registry.driver_rule_entry import DriverRuleEntry
from core.base.module.module_check import ModuleCheck
from core.base.module.subcommand_line import subcommand_line
from core.base.module.module_finder import ModuleFinder
from core.base.module.module_order import ModuleOrder
from core.base.module.sync_report import SyncReport
from core.base.journal_home import JournalHome
from core.base.provider.program_table import ProgramTable
from core.base.setting.setting_tree import SettingTree


DEFAULT_HANDLERS = {DottedPath.class_path(command).text: DottedPath.class_path(handler)
                    for command, handler in ((MakeCommand, MakeHandler), (EditCommand, EditHandler), (MoveCommand, MoveHandler), (DeleteCommand, DeleteHandler))}
class ModuleSync:
    """Updates the database and the registry to match the installed modules: finds, orders and checks them,
    runs the schema, gives each module its actor and each new commit listener its cursor, writes the
    registry, logging one registry.sync event when it changed, and writes the program table the Go hook reads."""

    def __init__(self, database: Database, clock: Clock, finder: ModuleFinder, order: ModuleOrder, check: ModuleCheck, schema: Schema,
                 triggers: Triggers, cursors: ListenerCursorTable, actors: ActorTable, registry_table: RegistryTable, fingerprint: CodeFingerprint,
                 entries: DriverEntries, providers: ProviderEntries, events: EventLog, home: JournalHome) -> None:
        self.database, self.clock, self.finder, self.order, self.check, self.events = database, clock, finder, order, check, events
        self.schema, self.triggers, self.cursors, self.fingerprint = schema, triggers, cursors, fingerprint
        self.actors, self.registry_table, self.entries, self.providers, self.home = actors, registry_table, entries, providers, home

    def run(self) -> SyncReport:
        modules = self.order.ordered(self.finder.modules())
        rules = self.entries.rules(modules)
        self.check.check(modules, rules)
        models = self.check.models(modules)
        migrations = self.schema.migrate((CORE_MIGRATIONS, *(ModuleMigrations(module.name, self.migrations(module)) for module in modules)))
        views = tuple(view for module in modules for view in module.views)
        self.schema.rebuild_views(views)
        self.triggers.rebuild(models)
        self.schema.check_tables(models, views)
        with self.database.transaction():
            timestamp = self.clock.timestamp().text
            self.actors.core_actor(timestamp)
            actor_ids = {module.name: self.actors.module_actor(module.name, timestamp) for module in modules}
            registry = self.registry(modules, rules, actor_ids)
            registry_changed = self.registry_table.write(registry.fingerprint, registry.entries_text(), timestamp)
            if registry_changed:
                self.events.write_registry_sync(CORE_ACTOR_ID, registry.fingerprint, timestamp)
            for module in modules:
                for listener in module.listeners:
                    if self.timing(listener) is ListenerTiming.COMMIT:
                        self.cursors.start(listener.name)
        self.home.program_table.write_text(ProgramTable([provider for module in modules for provider in module.providers]).text())
        return SyncReport(tuple(module.name for module in modules), migrations, registry_changed)

    def migrations(self, module: type[Module]) -> tuple[Migration, ...]:
        return tuple(migration() for migration in module.migrations)

    def registry(self, modules: tuple[type[Module], ...], rules: tuple[DriverRuleEntry, ...], actor_ids: dict[str, int]) -> Registry:
        guards = [guard for module in modules for guard in module.guards]
        listeners = [(module, listener) for module in modules for listener in module.listeners]
        return Registry(
            fingerprint=self.fingerprint.text(modules),
            module_fingerprints={module.name: self.fingerprint.module_text(module) for module in modules},
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
            windows=self.windows(modules),
            marks=self.marks(modules),
            docks=self.docks(modules),
            providers=self.providers.providers(modules),
            settings=tuple(entry for module in modules for entry in SettingTree().entries(module.name, module.settings)),
        )

    def windows(self, modules: tuple[type[Module], ...]) -> tuple[WindowEntry, ...]:
        shipped = set(self.finder.default_modules())
        return tuple(WindowEntry(window.name, module.name, window.title, window.entry, window.loading.value, window.place.value, tuple(window.roles),
                                 tuple(window.reads), tuple(window.runs), tuple(window.events), module in shipped, unavailable_reason(window.kit), window.icon.value,
                                 window.float_size.width, window.float_size.height, tuple(option.listed() for option in window.options), window.count)
                     for module in modules for window in module.windows)

    def marks(self, modules: tuple[type[Module], ...]) -> tuple[MarkEntry, ...]:
        shipped = set(self.finder.default_modules())
        return tuple(MarkEntry(mark.type.value, module.name, mark.family.name, mark.family.title, mark.family.icon, mark.family.group.value, mark.family.colouring.value,
                               tuple(variant.value for variant in mark.variants), mark.label, mark.mark_icon, mark.click.value, mark.grouping.value, mark.group_label,
                               tuple(button.listed() for button in mark.group_buttons), tuple(button.listed() for button in mark.buttons), mark.body, mark.shown, mark.main,
                               mark.process, module in shipped, unavailable_reason(mark.kit))
                     for module in modules for mark in module.marks)

    def docks(self, modules: tuple[type[Module], ...]) -> tuple[DockEntry, ...]:
        shipped = set(self.finder.default_modules())
        return tuple(DockEntry(dock.type.value, module.name, dock.icon, dock.title, dock.body, tuple(button.listed() for button in dock.buttons), dock.most,
                               dock.leaves_after_seconds, tuple(dock.reads), module in shipped, unavailable_reason(dock.kit))
                     for module in modules for dock in module.docks)

    def timing(self, listener: ListenerClass) -> ListenerTiming:
        if issubclass(listener, DeletionListener):
            return ListenerTiming.DELETION
        if issubclass(listener, SaveListener):
            return ListenerTiming.SAVE
        return ListenerTiming.COMMIT
