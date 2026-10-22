from datetime import datetime, timezone

from journal.events.models.updated import Updated
from journal.events.listener import Listener
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.models.support.ref import Ref
from journal.models.task import Task
from journal.repositories.agents import Agents
from journal.repositories.plans import Plans
from journal.repositories.setting_rows import SettingRows
from journal.repositories.tasks import WORKERS, Tasks


class AdvancePlan(Listener[Updated]):
    """A plan is done when its last task closes, whoever closes it. For each started plan the closed task is in, by its plan link, the next open task is started by writing its row, held by the agent that held the closed one, or by the main agent when a worker held it or none did; at a checkpoint out of auto mode, with no task that can start, or with that agent already on a task, nothing is written, and the state says what it makes of it."""

    def __init__(self, plans: Plans, tasks: Tasks, agents: Agents, settings: SettingRows) -> None:
        self.plans, self.tasks, self.agents, self.settings = plans, tasks, agents, settings

    def handle(self, event: Updated) -> None:
        task = event.model
        if not isinstance(task, Task) or not task.is_newly_closed(event.previous_row(Task)):
            return
        time = datetime.now(timezone.utc)
        for plan in [p for p in self.plans.containing(task) if self.plans.finished(p)]:
            self.plans.save(plan.finished(time.timestamp()), event.actor)
        for plan in [p for p in self.plans.containing(task) if p.state == PlanState.STARTED]:
            following, holder = self.plans.next_task(plan), self.next_holder(task)
            if following is not None and self.is_advancing(plan, holder):
                self.tasks.holder_started(following.plan_started(time, plan.row_id), holder, event.actor)

    def next_holder(self, task: Task) -> Ref | None:
        holder = self.tasks.holder(task)
        if holder is not None and holder.type != WORKERS:
            return holder
        present = self.agents.current()
        return None if present is None else Ref.build(present)

    def is_checkpoint_stop(self, plan: Plan) -> bool:
        from journal.features.tasks.feature import Tasks as TasksFeature
        return self.plans.checkpoint_plans(plan) is not None and not self.settings.option(TasksFeature.AUTO)

    def is_advancing(self, plan: Plan, holder: Ref | None) -> bool:
        return plan.state == PlanState.STARTED and not self.is_checkpoint_stop(plan) and (holder is None or self.tasks.holder_task(holder) is None)
