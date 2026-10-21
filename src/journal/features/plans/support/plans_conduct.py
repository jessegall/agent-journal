from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.rows.plan_approved import PlanApproved
from journal.events.rows.plan_blocked import PlanBlocked
from journal.events.rows.plan_reopened import PlanReopened
from journal.events.rows.plan_started import PlanStarted
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_started import TaskStarted


class PlansConduct(Conduct):
    """The plans feature's conduct in every state: the user's approval told, a plan blocked or open again told, the plan's next task named when the plan starts it, and the wait named when none can start, at a start or a close."""

    def on_plan_approved_plans(self, event: PlanApproved, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        return self.unchanged(Plans.THE_USER_APPROVED_THE_PLAN.create(n=event.plan_id)) if event.by_user else self.unchanged()

    def on_plan_blocked_plans(self, event: PlanBlocked, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        return self.unchanged(Plans.PLAN_BLOCKED.create(n=event.plan_id, why=event.why))

    def on_plan_reopened_plans(self, event: PlanReopened, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        return self.unchanged(Plans.PLAN_REOPENED.create(n=event.plan_id, why=event.why))

    def on_plan_started_plans(self, event: PlanStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        started = event.data.of(Plans).started
        if event.task_id or started is None or not started.tasks_left:
            return self.unchanged()
        return self.unchanged(Plans.PLAN_WAITS_ON_ITS_TASKS.create(n=event.plan_id, left=started.tasks_left))

    def on_task_started_plans(self, event: TaskStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        if not event.plan_id or event.by_agent(event.session):
            return self.unchanged()
        started = event.data.of(Plans).started
        return self.unchanged(Plans.NEXT_TASK_OF_THE_PLAN.create(n=event.plan_id, task=event.task_id, title=event.title, briefing=started.started_task_briefing if started else ""))

    def on_task_closed_plans(self, event: TaskClosed, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        started = event.data.of(Plans).started
        if started is None or event.task_id not in started.tasks or started.started_task or started.next_task or started.at_checkpoint or not started.tasks_left:
            return self.unchanged()
        return self.unchanged(Plans.PLAN_WAITS_ON_ITS_TASKS.create(n=started.plan_id, left=started.tasks_left))
