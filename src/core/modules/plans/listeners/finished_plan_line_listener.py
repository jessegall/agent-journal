from engine.command.context import Context
from engine.event.moved import Moved
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_main_agents import PlanMainAgents
from core.modules.plans.support.plan_nudges import PLAN_FINISHED

FINISHED_SOURCE = "plans.plan-finished"


class FinishedPlanLineListener(SaveListener[Moved[Plan]]):
    """A plan that closes as completed is told to its main agent, once: that is after the tests at its end
    passed, not when its last task ended."""

    name = "plans.finished-plan-line"
    moves = tuple([PlanLifecycle.close])
    disabled_scopes = [ActorScope]

    def __init__(self, main_agents: PlanMainAgents) -> None:
        self.main_agents = main_agents

    def handle(self, event: Moved[Plan], context: Context) -> None:
        self.main_agents.send(event.row, PLAN_FINISHED, FINISHED_SOURCE, context)
