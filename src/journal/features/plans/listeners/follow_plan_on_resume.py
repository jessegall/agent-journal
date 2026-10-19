from journal.engine.machine import Machine
from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.features.plans.states.following_plan import FollowingPlan
from journal.features.tasks.states.working import Working
from journal.models.actor_kind import ActorKind
from journal.models.plan_state import PlanState
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.not_found import NotFound
from journal.repositories.plans import Plans


class FollowPlanOnResume(Listener[Updated]):
    """An agent that takes up a task of a started plan, by start or resume, follows the plan again, so finishing the task starts the next."""

    def __init__(self, machine: Machine, plans: Plans) -> None:
        self.machine, self.plans = machine, plans

    def handle(self, event: Updated) -> None:
        task = event.model
        if not isinstance(task, Task) or task.state != TaskState.STARTED or event.by.kind != ActorKind.AGENT:
            return
        plan = next((p for p in self.plans.holding(task) if p.state == PlanState.STARTED), None)
        try:
            current = self.machine.current(event.by.id)
        except NotFound:
            return
        if plan is None or isinstance(current, FollowingPlan) or not isinstance(current, Working) or current.task_id != task.id:
            return
        self.machine.move(event.by.id, task.environment_id, FollowingPlan(plan_id=plan.id, task_id=task.id, logged_at=current.logged_at))
