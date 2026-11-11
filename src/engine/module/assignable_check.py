from collections.abc import Sequence

from engine.enums.actor_count import ActorCount
from engine.model.assignable import Assignable
from engine.module.module import Module

ASSIGNMENTS_MODULE = "journal.core.assignments"


class AssignableCheck:
    """Checks the assignable models before a sync writes anything: each says how many actors one of its rows
    takes, and the module that owns it depends on the assignments module."""

    def problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        problems: list[str] = []
        for module in modules:
            assignables = [declaration.model for declaration in module.models if issubclass(declaration.model, Assignable)]
            problems.extend(f"{model.__name__} is assignable and does not say how many actors a row takes: set takes_actors"
                            for model in assignables if not isinstance(getattr(model, "takes_actors", None), ActorCount))
            if assignables and module.name != ASSIGNMENTS_MODULE and ASSIGNMENTS_MODULE not in module.dependencies:
                problems.append(f"{module.name} owns the assignable {assignables[0].__name__} and does not depend on {ASSIGNMENTS_MODULE}")
        return tuple(problems)
