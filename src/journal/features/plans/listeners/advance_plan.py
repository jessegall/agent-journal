from datetime import datetime, timezone

from journal.events.models.updated import Updated
from journal.events.listener import Listener
from journal.features.plans.states.following_plan import FollowingPlan
from journal.features.plans.support.plan_control import PlanControl
from journal.models.agent import Agent
from journal.models.plan_state import PlanState
from journal.models.task import Task
from journal.repositories.agents import Agents
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks


class AdvancePlan(Listener[Updated]):
    """A plan is done when its last task closes, whoever closes it. For the agent following the plan with that task in hand, the next open task is started by writing its row; at a checkpoint, or with no task that can start, nothing is written, and the state says what it makes of it."""

    def __init__(self, plans: Plans, tasks: Tasks, agents: Agents, control: PlanControl) -> None:
        self.plans, self.tasks, self.agents, self.control = plans, tasks, agents, control

    def handle(self, event: Updated) -> None:
        task = event.model
        if not isinstance(task, Task) or not task.has_just_closed(event.was):
            return
        now = datetime.now(timezone.utc)
        for plan in [p for p in self.plans.holding(task) if self.plans.finished(p)]:
            self.plans.save(plan.done(now.timestamp()), event.by)
        plan_id = self.followed_with(task)
        if not plan_id:
            return
        plan = self.plans.find(plan_id)
        following = self.plans.next_task(plan)
        if plan.state != PlanState.STARTED or self.control.holds(plan) or following is None or self.tasks.in_hand() is not None:
            return
        self.tasks.save(following.started_by_plan(now, plan.id), event.by)

    def followed_with(self, task: Task) -> int:
        """The plan an agent here follows with this task in hand, by its stack, beneath a pause or not."""
        for agent in self.agents.in_():
            for layer in agent.stack:
                if layer["state"] == FollowingPlan.name and layer["data"].get("task_id") == task.id:
                    return int(layer["data"].get("plan_id", 0))
        return 0
