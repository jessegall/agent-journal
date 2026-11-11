from engine.skill.skill_contents import SkillContents
from engine.file.file_access import FileAccess
from collections.abc import Sequence

from engine.time.clock import Clock
from engine.agent.agent_group_entry import AgentGroupEntry
from engine.helper_type.helper_type_entry import HelperTypeEntry
from engine.registry.profile_entry import ProfileEntry
from engine.command.delete_command import DeleteCommand
from engine.command.edit_command import EditCommand
from engine.command.handlers.delete_handler import DeleteHandler
from engine.command.handlers.edit_handler import EditHandler
from engine.command.handlers.make_handler import MakeHandler
from engine.command.handlers.move_handler import MoveHandler
from engine.command.make_command import MakeCommand
from engine.command.move_command import MoveCommand
from engine.database.core_tables_migration import CORE_MIGRATIONS
from engine.actor.actor import CORE_ACTOR_ID
from engine.event.event_log import EventLog
from engine.database.database import Database
from engine.database.migration import Migration
from engine.database.schema import Schema
from engine.database.module_migrations import ModuleMigrations
from engine.database.triggers import Triggers
from engine.command.handlers.move_row_handler import MoveRowHandler
from engine.command.move_row import MoveRow
from engine.guard.lifecycle_guard import LifecycleGuard
from engine.module.module_states import modules_book
from engine.module.state_retirement import StateRetirement
from engine.registry.state_addition_entry import StateAdditionEntry
from engine.listener.deletion_listener import DeletionListener
from engine.database.actor_table import ActorTable
from engine.database.listener_cursor_table import ListenerCursorTable
from engine.database.registry_table import RegistryTable
from engine.listener.save_listener import SaveListener
from engine.module.code_fingerprint import CodeFingerprint
from engine.module.window_extensions import WindowExtensions
from engine.dotted_path.dotted_path import DottedPath
from engine.event.event_pattern import EventPattern
from engine.registry.guard_entry import GuardEntry
from engine.registry.listener_entry import ListenerEntry
from engine.enums.listener_timing import ListenerTiming
from engine.registry.model_entry import ModelEntry
from engine.registry.registry import Registry
from engine.registry.dock_entry import DockEntry
from engine.registry.template_entry import TemplateEntry
from engine.registry.button_entry import ButtonEntry
from engine.registry.inspector_entry import InspectorEntry
from engine.registry.move_entry import MoveEntry
from engine.registry.skill_entry import SkillEntry
from engine.skill.skill_declaration import SKILLS_FOLDER
from engine.registry.mark_entry import MarkEntry
from engine.registry.nudge_entry import NudgeEntry
from engine.registry.window_entry import WindowEntry
from engine.module.window_check import unavailable_reason
from engine.module.module import GuardClass, ListenerClass, Module
from engine.module.button_slots import ButtonSlots
from engine.module.inspector_slots import InspectorSlots
from engine.module.driver_entries import DriverEntries
from engine.module.provider_entries import ProviderEntries
from engine.registry.driver_rule_entry import DriverRuleEntry
from engine.module.module_check import ModuleCheck
from engine.module.subcommand_line import subcommand_line
from engine.module.module_finder import ModuleFinder
from engine.performance.performance_state import PerformanceState
from engine.module.module_order import ModuleOrder
from engine.module.sync_notes import SyncNotes
from engine.module.sync_report import SyncReport
from engine.journal.journal_home import JournalHome
from engine.provider.program_table import ProgramTable
from engine.registry.setting_tree import SettingTree
from engine.registry.tunnel_entry import TunnelEntry


DEFAULT_HANDLERS = {DottedPath.class_path(command).text: DottedPath.class_path(handler)
                    for command, handler in ((MakeCommand, MakeHandler), (EditCommand, EditHandler), (MoveCommand, MoveHandler), (DeleteCommand, DeleteHandler), (MoveRow, MoveRowHandler))}
class ModuleSync:
    """Updates the database and the registry to match the installed modules: finds, orders and checks them,
    runs the schema, gives each module its actor and each new commit listener its cursor, writes the registry,
    logging one registry.sync event when it changed, and writes the program table the Go hook reads."""

    def __init__(self, database: Database, clock: Clock, finder: ModuleFinder, order: ModuleOrder, check: ModuleCheck, schema: Schema,
                 triggers: Triggers, cursors: ListenerCursorTable, actors: ActorTable, registry_table: RegistryTable, fingerprint: CodeFingerprint,
                 entries: DriverEntries, providers: ProviderEntries, events: EventLog, home: JournalHome, notes: SyncNotes, retirement: StateRetirement) -> None:
        self.retirement = retirement
        self.database, self.clock, self.finder, self.order, self.check, self.events = database, clock, finder, order, check, events
        self.schema, self.triggers, self.cursors, self.fingerprint = schema, triggers, cursors, fingerprint
        self.actors, self.registry_table, self.entries, self.providers, self.home, self.notes = actors, registry_table, entries, providers, home, notes

    def run(self) -> SyncReport:
        with PerformanceState(self.home).reload():
            return self.synchronize()

    def has_pending_migrations(self) -> bool:
        return self.schema.has_pending(self.ordered_migrations(self.order.ordered(self.finder.modules())))

    def ordered_migrations(self, modules: Sequence[type[Module]]) -> tuple[ModuleMigrations, ...]:
        return (CORE_MIGRATIONS, *(ModuleMigrations(module.name, self.migrations(module)) for module in modules))

    def synchronize(self) -> SyncReport:
        modules = self.order.ordered(self.finder.modules())
        rules = self.entries.rules(modules)
        self.check.check(modules, rules)
        models = self.check.models(modules)
        migrations = self.schema.migrate(self.ordered_migrations(modules))
        views = tuple(view for module in modules for view in module.views)
        self.schema.rebuild_views(views)
        book = modules_book(modules)
        retired = self.retirement.retire(models, book, self.clock.timestamp().text)
        self.triggers.rebuild(models, book)
        self.schema.check_tables(models, views)
        with self.database.transaction():
            timestamp = self.clock.timestamp().text
            self.actors.core_actor(timestamp)
            actor_ids = self.actors.module_actors([module.name for module in modules], timestamp)
            registry = self.registry(modules, rules, actor_ids)
            registry_changed = self.registry_table.write(registry.fingerprint, registry.entries_text(), timestamp)
            if registry_changed:
                self.events.write_registry_sync(CORE_ACTOR_ID, registry.fingerprint, timestamp)
            listeners = [entry.name for entry in registry.listeners if entry.timing is ListenerTiming.COMMIT]
            self.cursors.remove_absent(listeners)
            for listener in listeners:
                self.cursors.start(listener)
        FileAccess.shared().write(self.home.program_table, ProgramTable([provider for module in modules for provider in module.providers]).text())
        return SyncReport(tuple(module.name for module in modules), migrations, registry_changed, (*retired, *self.notes.lines(modules), *(f"warning: {text}" for text in self.check.button_warnings(modules).values())))

    def migrations(self, module: type[Module]) -> tuple[Migration, ...]:
        return tuple(migration() for migration in module.migrations)

    def registry(self, modules: tuple[type[Module], ...], rules: tuple[DriverRuleEntry, ...], actor_ids: dict[str, int]) -> Registry:
        guards = sorted((guard for module in modules for guard in module.guards), key=lambda guard: guard.runs_last)
        first_guards = [guard for guard in guards if guard.runs_first]
        later_guards = [guard for guard in guards if not guard.runs_first]
        listeners = [(module, listener) for module in modules for listener in module.listeners]
        suites = self.finder.suite_list()
        return Registry(
            fingerprint=self.fingerprint.text(modules),
            events=self.check.known_events(modules),
            event_keys={entry.event: entry for entry in self.check.event_keys(modules)},
            declared_plugin_events=tuple(event for module in modules for event in module.plugin_event_names()),
            former_event_keys={former: current for module in modules for former, current in module.former_event_keys.items()},
            module_fingerprints={module.name: self.fingerprint.module_text(module) for module in modules},
            module_suites={module.name: suites.suite_names(module) for module in modules},
            models={declaration.model.cli_name: ModelEntry(module.name, DottedPath.class_path(declaration.model), tuple(DottedPath.class_path(command).text for command in declaration.commands),
                                                  declaration.excluded_subcommands) for module in modules for declaration in module.models},
            handlers={**DEFAULT_HANDLERS, **{DottedPath.class_path(handler.command).text: DottedPath.class_path(handler) for module in modules for handler in module.handlers}},
            subcommands={subcommand_line(subcommand): DottedPath.class_path(subcommand) for module in modules for subcommand in module.subcommands},
            outward_lines=tuple(sorted(subcommand_line(subcommand) for module in modules for subcommand in module.subcommands if subcommand.outward)),
            background_lines=tuple(sorted(subcommand_line(subcommand) for module in modules for subcommand in module.subcommands if subcommand.background)),
            guards=(*self.guard_entries(first_guards, -len(first_guards)),
                    GuardEntry(LifecycleGuard.name, EventPattern(LifecycleGuard.event), DottedPath.class_path(LifecycleGuard), 0, LifecycleGuard.short_flag),
                    *self.guard_entries(later_guards, 1)),
            listeners=tuple(ListenerEntry(listener.name, EventPattern(listener.event), self.timing(listener), DottedPath.class_path(listener), position,
                                          actor_ids[module.name]) for position, (module, listener) in enumerate(listeners, 1)),
            bindings={DottedPath.class_path(interface).text: DottedPath.class_path(implementation) for module in modules for interface, implementation in module.bindings.items()},
            overlays=self.entries.overlays(modules),
            rules=rules,
            suites=self.entries.suites(modules, self.finder.default_modules(), suites),
            drivers=self.entries.drivers(modules),
            windows=self.windows(modules),
            marks=self.marks(modules),
            nudges=self.nudges(modules),
            docks=self.docks(modules),
            templates=tuple(TemplateEntry(module.name, declaration) for module in modules for declaration in module.templates),
            buttons=self.buttons(modules),
            button_slots=self.button_slots(modules),
            inspectors=self.inspectors(modules),
            inspector_slots=tuple(sorted(InspectorSlots(modules).owners)),
            state_additions=tuple(StateAdditionEntry.declared(module.name, addition, module not in self.finder.default_modules()) for module in modules for addition in module.added_states),
            helper_types=tuple(HelperTypeEntry.declared(module.name, declaration) for module in modules for declaration in suites.helper_types(module)),
            agent_groups=tuple(AgentGroupEntry.declared(module.name, group) for module in modules for group in module.agent_groups),
            profiles=tuple(ProfileEntry.declared(module.name, profile) for module in modules for profile in module.profiles),
            providers=self.providers.providers(modules),
            settings=tuple(entry for module in modules for entry in SettingTree().entries(module.name, module.settings)),
            shared_rows={shared.row.model_name: DottedPath.class_path(shared) for module in modules for shared in module.shared_rows},
            library_shares={share.name: DottedPath.class_path(share) for module in modules for share in module.library_shares},
            tunnels=tuple(TunnelEntry(tunnel.name, DottedPath.class_path(tunnel), module.name, tunnel.title) for module in modules for tunnel in module.tunnels),
            skills=self.skills(modules),
            moves=tuple(MoveEntry(module.name, DottedPath.class_path(move), tuple(move.reads), tuple(move.drops), tuple(move.id_modules), tuple(move.references), tuple(move.setting_keys))
                        for module in modules for move in module.moves),
        )

    @staticmethod
    def guard_entries(guards: Sequence[GuardClass], first_position: int) -> tuple[GuardEntry, ...]:
        return tuple(GuardEntry(guard.name, EventPattern(guard.event), DottedPath.class_path(guard), position, guard.short_flag, guard.is_confirmation)
                     for position, guard in enumerate(guards, first_position))

    def windows(self, modules: tuple[type[Module], ...]) -> tuple[WindowEntry, ...]:
        shipped = set(self.finder.default_modules())
        extensions = WindowExtensions(modules)
        return tuple(WindowEntry(window.name, module.name, window.title, window.entry, window.loading.value, window.place.value, tuple(window.roles),
                                 tuple(window.reads), tuple(window.runs), tuple(window.events), module in shipped, unavailable_reason(window.kit), window.icon.value,
                                 window.float_size.width, window.float_size.height, tuple(option.listed() for option in window.options), window.count, tuple(window.shared_reads), window.group, window.auto_scroll.value, tuple(tab.listed() for tab in window.tabs),
                                 window.search.listed() if window.search is not None else {}, window.shows.value, tuple(part.listed() for part in window.skeleton), tuple(window.required_settings), tuple(source.listed() for source in window.sources), dict(window.links), tuple(window.slots))
                     for module in modules for window in map(extensions.extend, module.windows))

    def marks(self, modules: tuple[type[Module], ...]) -> tuple[MarkEntry, ...]:
        shipped = set(self.finder.default_modules())
        return tuple(MarkEntry(mark.type.value, module.name, mark.family.name, mark.family.title, mark.family.icon, mark.family.group.value, mark.family.colouring.value,
                               tuple(variant.value for variant in mark.variants), mark.label, mark.mark_icon, mark.click.value, mark.grouping.value, mark.group_label,
                               tuple(button.listed() for button in mark.group_buttons), tuple(button.listed() for button in mark.buttons), mark.body, mark.shown, mark.main,
                               mark.process, mark.full_width, mark.card, module in shipped, unavailable_reason(mark.kit))
                     for module in modules for mark in module.marks)

    def nudges(self, modules: tuple[type[Module], ...]) -> tuple[NudgeEntry, ...]:
        return tuple(NudgeEntry(nudge.key, module.name, nudge.type.value, nudge.text, nudge.interval.seconds if nudge.interval else 0, nudge.limit) for module in modules for nudge in module.nudges)

    def docks(self, modules: tuple[type[Module], ...]) -> tuple[DockEntry, ...]:
        shipped = set(self.finder.default_modules())
        return tuple(DockEntry(dock.type.value, module.name, dock.icon, dock.title, dock.body, tuple(button.listed() for button in dock.buttons), dock.most,
                               dock.leaves_after_seconds, tuple(dock.reads), module in shipped, unavailable_reason(dock.kit), dock.badge, dock.draws_head, dock.folds, dock.needs_user, dock.word, dock.reads_target)
                     for module in modules for dock in module.docks)

    def skills(self, modules: tuple[type[Module], ...]) -> tuple[SkillEntry, ...]:
        shipped = set(self.finder.default_modules())
        entries: list[SkillEntry] = []
        for module in modules:
            for skill in module.skills:
                path = module.folder() / SKILLS_FOLDER / skill.folder / skill.file
                entries.append(SkillEntry(skill.folder, module.name, skill.description, tuple(skill.keywords), tuple(skill.commands), tuple(skill.events),
                                          SkillContents.read(path).digest, str(path), module in shipped, types=tuple(skill.types), required_setting=skill.required_setting))
        return tuple(entries)

    def buttons(self, modules: tuple[type[Module], ...]) -> tuple[ButtonEntry, ...]:
        shipped = set(self.finder.default_modules())
        warnings = self.check.button_warnings(modules)
        return tuple(ButtonEntry(module.name, button, module in shipped, warnings.get(button.name, "")) for module in modules for button in module.declared_buttons())

    def inspectors(self, modules: tuple[type[Module], ...]) -> tuple[InspectorEntry, ...]:
        shipped = set(self.finder.default_modules())
        return tuple(InspectorEntry(module.name, inspector, module in shipped) for module in modules for inspector in module.inspectors)

    def button_slots(self, modules: tuple[type[Module], ...]) -> tuple[str, ...]:
        return tuple(sorted(ButtonSlots(modules).owners))

    def timing(self, listener: ListenerClass) -> ListenerTiming:
        if issubclass(listener, DeletionListener):
            return ListenerTiming.DELETION
        if issubclass(listener, SaveListener):
            return ListenerTiming.SAVE
        return ListenerTiming.COMMIT
