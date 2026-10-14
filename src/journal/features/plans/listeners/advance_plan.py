from datetime import datetime, timezone

from journal.engine.machine import Machine
from journal.events.models.updated import Updated
from journal.features.listener import Listener
from journal.features.plans.states.following_plan import FollowingPlan
from journal.models.actor_kind import ActorKind
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.not_found import NotFound
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks


class AdvancePlan(Listener[Updated]):
    """When an agent following a plan finishes the task it was on, the next open task is started for it; when none is left, the plan is done and the agent is idle."""

    def __init__(self, machine: Machine, plans: Plans, tasks: Tasks) -> None:
        self.machine, self.plans, self.tasks = machine, plans, tasks

    def handle(self, event: Updated) -> None:
        from journal.features.plans.feature import Plans as PlansFeature
        task = event.model
        if not isinstance(task, Task) or task.state != TaskState.DONE or event.by.kind != ActorKind.AGENT:
            return
        try:
            state = self.machine.current(event.by.id)
        except NotFound:
            return
        if not isinstance(state, FollowingPlan) or state.task_id != task.id:
            return
        plan = self.plans.find(state.plan_id)
        following = self.plans.next_task(plan)
        if following is None:
            self.plans.save(plan.done(), event.by)
            self.machine.move(event.by.id, task.environment_id, self.machine.states.first())
            print(PlansFeature.DONE.about(n=plan.id).rendered())
            return
        started = self.tasks.save(following.started(datetime.now(timezone.utc)), event.by)
        self.machine.move(event.by.id, task.environment_id, FollowingPlan(plan_id=plan.id, task_id=started.id))
        print(PlansFeature.NEXT.about(n=plan.id, task=started.id, title=started.title).rendered())
