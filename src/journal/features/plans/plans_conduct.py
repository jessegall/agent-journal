from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.rows.plan_approved import PlanApproved
from journal.events.rows.plan_blocked import PlanBlocked
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.plan_reopened import PlanReopened
from journal.events.rows.plan_reviewed import PlanReviewed
from journal.events.rows.plan_started import PlanStarted
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_started import TaskStarted


class PlansConduct(Conduct):
    """The plans feature's conduct in every state: the user's approval told, a plan blocked or open again told, the plan's next task named when the plan starts it, the wait named when none can start, at a start or a close, and a plan whose reviewers are all back told to be written into and readied, the agent's writes held once the set tool uses pass without it."""

    def on_plan_approved(self, event: PlanApproved, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        return self.none(Plans.PLAN_APPROVED.create(n=event.plan_id)) if event.user_origin else self.none()

    def on_plan_reviewed(self, event: PlanReviewed, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        return self.none(Plans.REVIEW_ENTRY_REQUEST.create(n=event.plan_id))

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        plans = event.data.part(Plans)
        uses = event.tool_use - plans.review_tool_use
        if event.subagent or not event.call.writes or not plans.review_plan or uses <= settings.integer(Plans.REVIEW_TOOL_USE_LIMIT):
            return self.none()
        return self.refuse(Plans.REVIEW_ENTRY_BLOCK.create(n=plans.review_plan, uses=uses))

    def on_plan_blocked(self, event: PlanBlocked, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        return self.none(Plans.PLAN_BLOCKED.create(n=event.plan_id, why=event.reason))

    def on_plan_reopened(self, event: PlanReopened, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        return self.none(Plans.PLAN_REOPENED.create(n=event.plan_id, why=event.reason))

    def on_plan_started(self, event: PlanStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        started = event.data.part(Plans).started
        if event.task_id or started is None or not started.remaining_tasks:
            return self.none()
        return self.none(Plans.PLAN_STALLED.create(n=event.plan_id, left=started.remaining_tasks))

    def on_task_started(self, event: TaskStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.tasks.feature import Tasks
        if not event.plan_id or event.is_agents(event.session) or event.task_id not in event.data.part(Tasks).agent_tasks:
            return self.none()
        started = event.data.part(Plans).started
        return self.none(Plans.NEXT_PLAN_TASK.create(n=event.plan_id, task=event.task_id, title=event.title, briefing=started.started_task_briefing if started else ""))

    def on_task_closed(self, event: TaskClosed, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        started = event.data.part(Plans).started
        if started is None or event.task_id not in started.tasks or started.started_task or started.next_task or started.checkpoint_pause or not started.remaining_tasks:
            return self.none()
        return self.none(Plans.PLAN_STALLED.create(n=started.plan_id, left=started.remaining_tasks))
