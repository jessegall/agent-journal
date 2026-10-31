from collections.abc import Sequence
from core.base.change.event_pattern import EventPattern
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.registry.dotted_path import DottedPath
from core.base.module.module import Module, SubcommandClass
from core.base.module.module_error import ModuleError
from core.base.module.name_groups import NameGroups
from core.base.module.suite_check import SuiteCheck
from core.base.registry.driver_rule_entry import DriverRuleEntry

STANDARD_CHANGES = ("create", "update", "delete", "metadata")
LIFECYCLE_ATTRIBUTES = ("states", "initial", "editable", "deletable")


class ModuleCheck:
    """Checks the modules before a sync writes anything: every event a guard or listener names exists, no two
    modules claim one name, table or command, and every lifecycle is complete; all problems are reported at
    once."""

    def __init__(self, tables: Tables, suites: SuiteCheck) -> None:
        self.tables, self.suites = tables, suites

    def known_events(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        events: list[str] = []
        for model in self.models(modules):
            moves = tuple(move.name for move in model.lifecycle.moves()) if model.lifecycle else ()
            events.extend(f"{model.model_name}.{change}" for change in STANDARD_CHANGES + moves)
        return tuple(events)

    def check(self, modules: Sequence[type[Module]], rules: Sequence[DriverRuleEntry]) -> None:
        problems = (self.duplicate_names(modules, rules) + self.lifecycle_problems(modules) + self.event_problems(modules) + self.duplicate_handlers(modules)
                    + self.duplicate_subcommands(modules) + self.suites.problems(modules, rules))
        if problems:
            raise ModuleError("the modules cannot be synced: " + "; ".join(problems))

    def models(self, modules: Sequence[type[Module]]) -> tuple[type[Model], ...]:
        return tuple(declaration.model for module in modules for declaration in module.models)

    def duplicate_names(self, modules: Sequence[type[Module]], rules: Sequence[DriverRuleEntry]) -> tuple[str, ...]:
        models = self.models(modules)
        switch_names = [*(guard.name for module in modules for guard in module.guards), *(listener.name for module in modules for listener in module.listeners),
                        *(rule.name for rule in rules)]
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
            problems.extend(f"{model.__name__}'s move {name} is named unlike its attribute" for name in lifecycle.misnamed_moves())
            reachable = {move.target for move in moves} | set(lifecycle.initial)
            problems.extend(f"{model.__name__}'s state {state.value} is no move's target and not a first state" for state in lifecycle.states if state not in reachable)
        return tuple(problems)

    def event_problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        events = self.known_events(modules)
        declared = [(guard.name, guard.event) for module in modules for guard in module.guards]
        declared += [(listener.name, listener.event) for module in modules for listener in module.listeners]
        return tuple(f"{name} covers {event}, which no model raises" for name, event in declared if not any(EventPattern(event).matches(event_name) for event_name in events))

    def duplicate_handlers(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        commands = [DottedPath.class_path(handler.command).text for module in modules for handler in module.handlers]
        return tuple(f"two handlers carry out {command}" for command in sorted({command for command in commands if commands.count(command) > 1}))

    def duplicate_subcommands(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        lines = [subcommand_line(subcommand) for module in modules for subcommand in module.subcommands]
        return tuple(f"two subcommands answer journal {line}" for line in sorted({line for line in lines if lines.count(line) > 1}))


def subcommand_line(subcommand: SubcommandClass) -> str:
    return f"{subcommand.cli_name} {subcommand.name}"
