from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.plans.commands.repair_plan_states.repair_plan_states import RepairPlanStates


class PlanStateRound:
    """Every hour repairs the plan states that should never exist, for a journal an older version or a lost
    event left so."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(RepairPlanStates(), Actor.core())
