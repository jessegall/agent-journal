from datetime import datetime, timezone

from journal.engine.machine import Machine
from journal.engine.states.paused import Paused
from journal.events.models.updated import Updated
from journal.events.listener import Listener
from journal.features.plans.states.following_plan import FollowingPlan
from journal.models.actor_kind import ActorKind
from journal.models.task import Task
from journal.models.plan_state import PlanState
from journal.models.task_state import TaskState
from journal.repositories.not_found import NotFound
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks


class AdvancePlan(Listener[Updated]):
    """A plan is done when its last task closes, whoever closes it. When an agent following a plan finishes the task it was on, the next open task is started for it; at a checkpoint phase's end the plan waits and the agent keeps following it with no task in hand, the Idle workflow saying what the mode makes of it; when only blocked or parked tasks are left, the plan waits with the agent following it; when every task is closed, the plan is done and the agent idle."""

    def __init__(self, machine: Machine, plans: Plans, tasks: Tasks) -> None:
        self.machine, self.plans, self.tasks = machine, plans, tasks

    def following(self, event: Updated) -> FollowingPlan | None:
        """The plan-following state of the agent that closed the task, when an agent did and it follows a plan, now or once its pause ends."""
        if event.by.kind != ActorKind.AGENT:
            return None
        try:
            state = self.machine.current(event.by.id)
        except NotFound:
            return None
        if isinstance(state, Paused):
            state = self.machine.states.resumed(state)
        return state if isinstance(state, FollowingPlan) else None

    def handle(self, event: Updated) -> None:
        from journal.features.plans.feature import Plans as PlansFeature
        task = event.model
        if not isinstance(task, Task) or task.state != TaskState.DONE:
            return
        for plan in [p for p in self.plans.holding(task) if self.plans.finished(p)]:
            self.plans.save(plan.done(), event.by)
            print(PlansFeature.DONE.about(n=plan.id).rendered())
        state = self.following(event)
        if state is None or state.task_id != task.id:
            return
        plan = self.plans.find(state.plan_id)
        if plan.state == PlanState.DONE:
            self.machine.move(event.by.id, task.environment_id, self.machine.states.first())
            return
        checkpoint = self.plans.at_checkpoint(plan)
        if checkpoint is not None:
            self.machine.move(event.by.id, task.environment_id, FollowingPlan(plan_id=plan.id))
            print(PlansFeature.CHECKPOINT.about(n=plan.id, phase=checkpoint.title).rendered())
            return
        following = self.plans.next_task(plan)
        if following is None:
            self.machine.move(event.by.id, task.environment_id, FollowingPlan(plan_id=plan.id))
            blocked = [str(t.id) for t in self.plans.tasks_of(plan) if t.state in (TaskState.BLOCKED, TaskState.PARKED)]
            print(PlansFeature.WAITING.about(n=plan.id, blocked=f"tasks {', '.join(blocked)} wait" if len(blocked) > 1 else f"task {blocked[0]} waits").rendered())
            return
        started = self.tasks.save(following.started(datetime.now(timezone.utc)), event.by)
        self.machine.move(event.by.id, task.environment_id, FollowingPlan(plan_id=plan.id, task_id=started.id))
        print(PlansFeature.NEXT.about(n=plan.id, task=started.id, title=started.title).rendered())
