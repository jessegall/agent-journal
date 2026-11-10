from engine.actor.actor import Actor
from core.base.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.plans.commands.start_plan.start_plan import StartPlan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.support.task_plans import TaskPlans
from core.base.change.moved import Moved
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class StartedTaskPlanListener(CommitListener[Moved[Task]]):
    """A task started inside an approved plan starts the plan, so a plan never stays approved while its work goes."""

    name = "plans.started-task-plan"
    moves = tuple([TaskLifecycle.start])

    def __init__(self, bus: Bus, plans: TaskPlans) -> None:
        self.bus, self.plans = bus, plans

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        plan = self.plans.find(event.row.id)
        if plan is not None and plan.state is PlanState.APPROVED:
            self.bus.run(StartPlan(plan.id), Actor.core(), cause_id=logged.id)
