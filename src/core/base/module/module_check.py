from core.base.change.event_pattern import EventPattern
from core.base.command.command import Command
from core.base.command.handler import Handler, is_handler_class
from core.base.guard.guard import Guard
from core.base.listener.commit_listener import CommitListener
from core.base.listener.deletion_listener import DeletionListener
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.module.dotted_path import DottedPath
from core.base.module.module import Module
from core.base.module.module_error import ModuleError

STANDARD_CHANGES = ("create", "update", "delete", "metadata")
LIFECYCLE_ATTRIBUTES = ("states", "initial", "editable", "deletable")


class ModuleCheck:
    """Checks the modules before a sync writes anything: every event a guard or listener names exists, no two
    modules claim one name, table or command, and every lifecycle is complete; all problems are reported at
    once."""

    def __init__(self, tables: Tables) -> None:
        self.tables = tables

    def known_events(self, modules: tuple[type[Module], ...]) -> tuple[str, ...]:
        events: list[str] = []
        for model in self.models(modules):
            moves = tuple(move.name for move in model.lifecycle.moves()) if model.lifecycle else ()
            events.extend(f"{model.name}.{change}" for change in STANDARD_CHANGES + moves)
        return tuple(events)

    def check(self, modules: tuple[type[Module], ...]) -> None:
        problems = self.name_clashes(modules) + self.lifecycle_problems(modules) + self.event_problems(modules) + self.handler_clashes(modules)
        if problems:
            raise ModuleError("the modules cannot be synced: " + "; ".join(problems))

    def models(self, modules: tuple[type[Module], ...]) -> tuple[type[Model], ...]:
        return tuple(noun.model for module in modules for noun in module.nouns)

    def name_clashes(self, modules: tuple[type[Module], ...]) -> tuple[str, ...]:
        models = self.models(modules)
        names = [model.name for model in models]
        tables = [self.tables.table(model).name for model in models]
        guards = [self.guard(path).name for module in modules for path in module.guards]
        listeners = [self.listener_name(path) for module in modules for path in module.listeners]
        return tuple(f"two {kind} named {name}" for kind, values in (("models", names), ("tables", tables), ("guards", guards), ("listeners", listeners))
                     for name in sorted({value for value in values if values.count(value) > 1}))

    def lifecycle_problems(self, modules: tuple[type[Module], ...]) -> tuple[str, ...]:
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

    def event_problems(self, modules: tuple[type[Module], ...]) -> tuple[str, ...]:
        events = self.known_events(modules)
        declared = [(self.guard(path).name, self.guard(path).event) for module in modules for path in module.guards]
        declared += [(self.listener_name(path), self.listener_event(path)) for module in modules for path in module.listeners]
        return tuple(f"{name} covers {event}, which no model raises" for name, event in declared if not any(EventPattern(event).matches(event_name) for event_name in events))

    def handler_clashes(self, modules: tuple[type[Module], ...]) -> tuple[str, ...]:
        commands = [DottedPath.class_path(self.handler(path).command).text for module in modules for path in module.handlers]
        return tuple(f"two handlers carry out {command}" for command in sorted({command for command in commands if commands.count(command) > 1}))

    def guard(self, path: str) -> type[Guard]:
        loaded = DottedPath(path).loaded()
        if not issubclass(loaded, Guard):
            raise ModuleError(f"{path} is no guard")
        return loaded

    def handler(self, path: str) -> type[Handler[Command[object], object]]:
        loaded = DottedPath(path).loaded()
        if not is_handler_class(loaded):
            raise ModuleError(f"{path} is no handler")
        return loaded

    def listener_name(self, path: str) -> str:
        return self.listener(path).name

    def listener_event(self, path: str) -> str:
        return self.listener(path).event

    def listener(self, path: str) -> type[DeletionListener] | type[SaveListener] | type[CommitListener]:
        loaded = DottedPath(path).loaded()
        if issubclass(loaded, DeletionListener):
            return loaded
        if issubclass(loaded, SaveListener):
            return loaded
        if issubclass(loaded, CommitListener):
            return loaded
        raise ModuleError(f"{path} is no listener")
