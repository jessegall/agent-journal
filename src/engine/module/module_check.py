from collections.abc import Sequence
from engine.event.change import METADATA
from engine.enums.event_form import EventForm
from engine.event.event_log import JOURNAL_BOOTING_EVENT, REGISTRY_SYNC_EVENT, UPGRADE_FINISHED_EVENT, UPGRADE_MOVED_EVENT
from engine.event.event_pattern import EventPattern
from engine.model.model import Model
from engine.model.state_book import StateBook
from engine.model.tables import Tables
from engine.dotted_path.dotted_path import DottedPath
from engine.module.module import Module
from engine.module.errors.module_error import ModuleError
from engine.module.module_states import modules_book
from engine.module.state_check import StateCheck
from engine.module.assignable_check import AssignableCheck
from engine.module.helper_type_check import HelperTypeCheck
from engine.module.profile_check import ProfileCheck
from engine.module.name_groups import NameGroups
from engine.module.subcommand_line import subcommand_line
from engine.module.provider_check import ProviderCheck
from engine.module.suite_check import SuiteCheck
from engine.module.window_check import WindowCheck
from engine.module.mark_check import MarkCheck
from engine.module.dock_check import DockCheck
from engine.module.inspector_check import InspectorCheck
from engine.module.move_check import MoveCheck
from engine.module.skill_check import SkillCheck
from engine.registry.driver_rule_entry import DriverRuleEntry
from engine.registry.event_key_entry import EventKeyEntry
from engine.module.setting_check import SettingCheck
from engine.module.template_check import TemplateCheck
from engine.module.button_check import ButtonCheck
from engine.module.module_finder import ModuleFinder

STANDARD_CHANGES = ("create", "update", "delete", METADATA)
LIFECYCLE_ATTRIBUTES = ("states", "initial", "editable", "deletable")
SYSTEM_EVENTS = (JOURNAL_BOOTING_EVENT, REGISTRY_SYNC_EVENT, UPGRADE_MOVED_EVENT, UPGRADE_FINISHED_EVENT)
SYSTEM_EVENTS_MODULE = "journal.core"
COMMIT_FORM = tuple([EventForm.COMMIT])


class ModuleCheck:
    """Checks the modules before a sync writes anything: every event a guard or listener names exists, no two
    modules claim one name, table or command, and every lifecycle is complete; all problems are reported at
    once."""

    def __init__(self, tables: Tables, suites: SuiteCheck, windows: WindowCheck, providers: ProviderCheck, marks: MarkCheck,
                 docks: DockCheck, settings: SettingCheck, skills: SkillCheck, moves: MoveCheck, templates: TemplateCheck,
                 buttons: ButtonCheck, finder: ModuleFinder, states: StateCheck, helper_types: HelperTypeCheck, profiles: ProfileCheck, inspectors: InspectorCheck, assignables: AssignableCheck) -> None:
        self.tables, self.suites, self.windows, self.providers, self.marks, self.docks = tables, suites, windows, providers, marks, docks
        self.settings, self.skills, self.moves = settings, skills, moves
        self.templates = templates
        self.states = states
        self.helper_types = helper_types
        self.profiles = profiles
        self.buttons, self.finder = buttons, finder
        self.inspectors = inspectors
        self.assignables = assignables

    def known_events(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        book = modules_book(modules)
        return tuple(event for module in modules for event in self.module_events(module, book))

    @staticmethod
    def module_events(module: type[Module], book: StateBook) -> dict[str, tuple[EventForm, ...]]:
        events = dict.fromkeys(module.file_events, COMMIT_FORM)
        for declaration in module.models:
            model = declaration.model
            lifecycle = book.lifecycle(model)
            moves = tuple(move.name for move in lifecycle.moves()) if lifecycle else ()
            events.update({f"{model.model_name}.{change}": () if change == METADATA else model.event_forms for change in (*STANDARD_CHANGES, *moves, *model.change_names)})
        return events

    @classmethod
    def event_keys(cls, modules: Sequence[type[Module]]) -> tuple[EventKeyEntry, ...]:
        book = modules_book(modules)
        entries = [EventKeyEntry.built(module.name, event, forms) for module in modules for event, forms in cls.module_events(module, book).items() if forms]
        plugin_events = [EventKeyEntry.plugin_event(module.name, name) for module in modules for name in module.plugin_event_names()]
        return (*(EventKeyEntry.system(SYSTEM_EVENTS_MODULE, event, COMMIT_FORM) for event in SYSTEM_EVENTS), *entries, *plugin_events)

    def check(self, modules: Sequence[type[Module]], rules: Sequence[DriverRuleEntry]) -> None:
        problems = (self.duplicate_names(modules, rules) + self.lifecycle_problems(modules) + self.event_problems(modules) + self.duplicate_event_keys(modules) + self.duplicate_handlers(modules)
                    + self.duplicate_subcommands(modules) + self.suites.problems(modules, rules, self.finder.suite_list()) + self.windows.problems(modules, self.known_events(modules)) + self.inspectors.problems(modules, self.known_events(modules))
                    + self.providers.problems(modules) + self.marks.problems(modules) + self.docks.problems(modules) + self.settings.problems(modules)
                    + self.skills.problems(modules, self.known_events(modules)) + self.moves.problems(modules) + self.templates.problems(modules) + self.states.problems(modules) + self.assignables.problems(modules)
                    + self.buttons.declared_problems(modules, frozenset(module.name for module in self.finder.default_modules()))
                    + self.helper_types.problems(modules, rules, self.finder.suite_list()) + self.profiles.problems(modules, self.finder.suite_list()))
        if problems:
            raise ModuleError("the modules cannot be synced: " + "; ".join(problems))

    def button_warnings(self, modules: Sequence[type[Module]]) -> dict[str, str]:
        return self.buttons.declared_warnings(modules, frozenset(module.name for module in self.finder.default_modules()))

    def models(self, modules: Sequence[type[Module]]) -> tuple[type[Model], ...]:
        return tuple(declaration.model for module in modules for declaration in module.models)

    def duplicate_names(self, modules: Sequence[type[Module]], rules: Sequence[DriverRuleEntry]) -> tuple[str, ...]:
        models = self.models(modules)
        switch_names = [*(guard.name for module in modules for guard in module.guards), *(listener.name for module in modules for listener in module.listeners),
                        *(name for name, _ in dict.fromkeys((rule.name, rule.path.text) for rule in rules))]
        return NameGroups.duplicates([("models", [model.model_name for model in models]), ("tables", [self.tables.table(model).name for model in models]),
                                      ("guards, listeners or driver rules", switch_names)])

    def lifecycle_problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        problems: list[str] = []
        for model in self.models(modules):
            lifecycle = model.lifecycle
            if lifecycle is None:
                continue
            missing = [attribute for attribute in LIFECYCLE_ATTRIBUTES if not hasattr(lifecycle, attribute)]
            if missing or not lifecycle.moves() or not lifecycle.initial:
                problems.append(f"{model.__name__}'s lifecycle is incomplete: it needs {', '.join(LIFECYCLE_ATTRIBUTES)}, a first state and a move")
                continue
            moves = lifecycle.moves()
            problems.extend(f"{model.__name__}'s move {move.name} names a state outside {lifecycle.states.__name__}"
                            for move in moves if not all(isinstance(state, lifecycle.states) for state in (*move.sources, move.target)))
            problems.extend(f"{model.__name__}'s move {move.name} is named like a standard change" for move in moves if move.name in STANDARD_CHANGES)
            problems.extend(f"{model.__name__}'s move {name} is named unlike its attribute" for name in lifecycle.attribute_name_mismatches())
            reachable = {move.target for move in moves} | set(lifecycle.initial)
            problems.extend(f"{model.__name__}'s state {state.value} is no move's target and not a first state" for state in lifecycle.states if state not in reachable)
        return tuple(problems)

    def event_problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        events = self.known_events(modules)
        guards = [(guard.name, guard.event, events) for module in modules for guard in module.guards]
        listeners = [(listener.name, listener.event, (*events, *SYSTEM_EVENTS)) for module in modules for listener in module.listeners]
        return tuple(f"{name} covers {event}, which no model raises" for name, event, raised in guards + listeners
                     if not any(EventPattern(event).matches(event_name) for event_name in raised))

    def duplicate_event_keys(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        keys = [entry.key for entry in self.event_keys(modules)]
        return tuple(f"two events have the key {key}" for key in sorted({key for key in keys if keys.count(key) > 1}))

    def duplicate_handlers(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        commands = [DottedPath.class_path(handler.command).text for module in modules for handler in module.handlers]
        return tuple(f"two handlers carry out {command}" for command in sorted({command for command in commands if commands.count(command) > 1}))

    def duplicate_subcommands(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        lines = [subcommand_line(subcommand) for module in modules for subcommand in module.subcommands]
        return tuple(f"two subcommands answer journal {line}" for line in sorted({line for line in lines if lines.count(line) > 1}))

