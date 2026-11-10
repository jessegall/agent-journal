from engine.change.created import Created
from engine.change.updated import Updated
from engine.command.context import Context
from engine.guard.guard import Guard
from core.base.profile.model_tier import ModelTier
from engine.provider.providers import Providers
from engine.errors.refusal import Refusal
from core.modules.tasks.models.task_tag import TAG_WORD
from suites.coding.modules.workers.models.worker_route import WorkerRoute


class WorkerRouteShapeGuard(Guard[Created[WorkerRoute] | Updated[WorkerRoute]]):
    """Checks a route's conditions and destination before saving."""

    name = "workers.route-shape"
    is_safety = True

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def check(self, event: Created[WorkerRoute] | Updated[WorkerRoute], context: Context) -> None:
        route = event.row
        if not route.tags and not route.needs_complexity:
            raise Refusal("a route needs tags or complexity", "use the split for tasks without conditions")
        if not route.program and route.tier is None:
            raise Refusal("a route needs a program or tier")
        if route.strict and not route.program:
            raise Refusal("a strict route needs a program")
        if route.tier is ModelTier.RARE:
            raise Refusal("a route cannot use the rare tier", "name that model explicitly at dispatch")
        if any(not TAG_WORD.fullmatch(word) for word in route.tags):
            raise Refusal("route tags use lower case letters, digits and hyphens")
        if route.minimum_complexity is not None and route.maximum_complexity is not None and route.minimum_complexity > route.maximum_complexity:
            raise Refusal("the complexity range must start at or below its end")
        changing_program = event.old_row is None or event.old_row.program != route.program
        if changing_program and route.program and route.program not in {provider.name for provider in self.providers.all()}:
            raise Refusal(f"unknown program {route.program}", "choose an installed provider module")
