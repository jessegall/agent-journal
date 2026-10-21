from datetime import datetime, timezone

from journal.events.models.updated import Updated
from journal.events.listener import Listener
from journal.features.plans.states.following_plan import FollowingPlan
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.models.task import Task
from journal.repositories.agents import Agents
from journal.repositories.plans import Plans
from journal.repositories.setting_rows import SettingRows
from journal.repositories.tasks import Tasks


class AdvancePlan(Listener[Updated]):
    """A plan is done when its last task closes, whoever closes it. For the agent following the plan with that task in hand, the next open task is started by writing its row; at a checkpoint out of auto mode, or with no task that can start, nothing is written, and the state says what it makes of it. The plan followed is read from the agent's stack, beneath a pause or not."""

    def __init__(self, plans: Plans, tasks: Tasks, agents: Agents, settings: SettingRows) -> None:
        self.plans, self.tasks, self.agents, self.settings = plans, tasks, agents, settings

    def handle(self, event: Updated) -> None:
        task = event.model
        if not isinstance(task, Task) or not task.has_just_closed(event.was):
            return
        time = datetime.now(timezone.utc)
        for plan in [p for p in self.plans.holding(task) if self.plans.finished(p)]:
            self.plans.save(plan.done(time.timestamp()), event.actor)
        plan_id = self.followed_with(task)
        if not plan_id:
            return
        plan = self.plans.find(plan_id)
        following = self.plans.next_task(plan)
        if plan.state != PlanState.STARTED or self.is_stopped_at_checkpoint(plan) or following is None or self.tasks.in_hand() is not None:
            return
        self.tasks.save(following.started_by_plan(time, plan.id), event.actor)

    def is_stopped_at_checkpoint(self, plan: Plan) -> bool:
        from journal.features.tasks.feature import Tasks as TasksFeature
        return self.plans.at_checkpoint(plan) is not None and not self.settings.option(TasksFeature.AUTO)

    def followed_with(self, task: Task) -> int:
        for agent in self.agents.in_():
            for layer in agent.stack:
                if layer["state"] == FollowingPlan.name and layer["data"].get("task_id") == task.id:
                    return int(layer["data"].get("plan_id", 0))
        return 0
