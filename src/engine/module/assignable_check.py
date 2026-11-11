from collections.abc import Sequence

from engine.enums.actor_count import ActorCount
from engine.model.assignable import Assignable
from engine.module.module import Module

ASSIGNMENTS_MODULE = "journal.core.assignments"


class AssignableCheck:
    """Checks the assignable models before a sync writes anything: each says how many actors one of its rows
    takes, and the module that owns it depends on the assignments module; every model it assigns as a child is
    assignable, a model several actors hold has no child that one actor holds, and no models assign each other
    in a loop."""

    def problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        problems: list[str] = []
        for module in modules:
            assignables = [declaration.model for declaration in module.models if issubclass(declaration.model, Assignable)]
            problems.extend(f"{model.__name__} is assignable and does not say how many actors a row takes: set takes_actors"
                            for model in assignables if not isinstance(getattr(model, "takes_actors", None), ActorCount))
            if assignables and module.name != ASSIGNMENTS_MODULE and ASSIGNMENTS_MODULE not in module.dependencies:
                problems.append(f"{module.name} owns the assignable {assignables[0].__name__} and does not depend on {ASSIGNMENTS_MODULE}")
            for model in assignables:
                problems.extend(self.children_problems(model))
        return (*problems, *self.loop_problems([declaration.model for module in modules for declaration in module.models if issubclass(declaration.model, Assignable)]))

    @staticmethod
    def children_problems(model: type[Assignable]) -> list[str]:
        problems: list[str] = []
        for children in model.assigns:
            child = children.model
            if not issubclass(child, Assignable):
                problems.append(f"{model.__name__} assigns its {child.__name__} rows, and {child.__name__} is not assignable")
            elif getattr(model, "takes_actors", None) is ActorCount.SEVERAL and getattr(child, "takes_actors", None) is ActorCount.SINGLE:
                problems.append(f"{model.__name__} takes several actors and its child {child.__name__} takes one: the child could inherit no single actor")
        return problems

    def loop_problems(self, models: Sequence[type[Assignable]]) -> list[str]:
        loops = {self.loop_from(model, tuple([model])) for model in models}
        return [f"these models assign each other in a loop: {', '.join(loop)}" for loop in sorted(loops) if loop]

    def loop_from(self, model: type[Assignable], path: tuple[type, ...]) -> tuple[str, ...]:
        for children in model.assigns:
            child = children.model
            if child in path:
                return tuple(sorted(visited.__name__ for visited in path[path.index(child):]))
            loop = self.loop_from(child, (*path, child)) if issubclass(child, Assignable) else ()
            if loop:
                return loop
        return ()
