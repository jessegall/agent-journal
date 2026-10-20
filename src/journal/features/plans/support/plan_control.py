from datetime import datetime, timezone

from journal.engine.state_machine import StateMachine
from journal.engine.nudge import Nudge
from journal.features.plans.states.following_plan import FollowingPlan
from journal.support.actor import Actor
from journal.models.plan import Plan
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.support.refused import Refused
from journal.support.not_found import NotFound
from journal.features.plans.support.plans_standing_reader import NOTHING_YET
from journal.repositories.plans import Plans
from journal.support.task_briefing import TaskBriefing
from journal.repositories.setting_rows import SettingRows
from journal.repositories.tasks import Tasks


class PlanControl:
    """Starting, parking and abandoning a plan, the one way for the command and the viewer alike: the task in hand and the agent following the plan move with it. The session is the agent's that follows, empty when none does."""

    def __init__(self, plans: Plans, tasks: Tasks, machine: StateMachine, settings: SettingRows, briefing: TaskBriefing) -> None:
        self.plans, self.tasks, self.machine, self.settings = plans, tasks, machine, settings
        self.briefing = briefing

    def holds(self, plan: Plan) -> bool:
        from journal.features.tasks.feature import Tasks as TasksFeature
        return not self.settings.option(TasksFeature.AUTO) and self.plans.at_checkpoint(plan) is not None

    def start(self, plan: Plan, session: str, by: Actor) -> Nudge:
        from journal.features.plans.feature import Plans as PlansFeature
        if plan.is_blocked():
            raise Refused(f"plan {plan.id} is blocked, waiting on: {self.tasks.reason(plan)}; `journal plan unblock {plan.id}` when it may go on")
        if not plan.state.can_be_started():
            raise Refused(f"plan {plan.id} is {plan.state}, not approved: the user approves it first")
        if self.plans.finished(plan):
            self.plans.save(plan.done(), by)
            return PlansFeature.PLAN_DONE.create(n=plan.id)
        task = self.plans.resumable(plan)
        if task is not None:
            self.tasks.refuse_second(task.started(datetime.now(timezone.utc)))
        now = datetime.now(timezone.utc).timestamp()
        plan = self.plans.save(plan.started_with_nothing_to_start(now) if task is None else plan.started(task, now), by)
        if task is None:
            self.follow(session, plan, FollowingPlan(plan_id=plan.id))
            return self.waiting(plan)
        started = self.tasks.save(task.started(datetime.now(timezone.utc)), by)
        self.follow(session, plan, FollowingPlan(plan_id=plan.id, task_id=started.id))
        return PlansFeature.NEXT_TASK_OF_THE_PLAN.create(n=plan.id, task=started.id, title=started.title, briefing=self.briefing.said(started) or NOTHING_YET)

    def waiting(self, plan: Plan) -> Nudge:
        from journal.features.plans.feature import Plans as PlansFeature
        left = [str(t.id) for t in self.plans.tasks_of(plan) if not t.is_closed()]
        return PlansFeature.PLAN_WAITS_ON_ITS_TASKS.create(n=plan.id, left=f"task {left[0]} is" if len(left) == 1 else f"tasks {', '.join(left)} are")

    def park(self, plan: Plan, session: str, by: Actor) -> Plan:
        parked = self.plans.save(plan.parked(), by)
        for task in [t for t in self.plans.tasks_of(parked) if t.state == TaskState.STARTED]:
            self.tasks.save(task.parked(f"plan {parked.id} was parked", datetime.now(timezone.utc)), by)
        self.let_go(session, parked)
        return parked

    def abandon(self, plan: Plan, session: str, by: Actor) -> list[Task]:
        gone = self.plans.cancel(plan, by)
        self.let_go(session, plan)
        return gone

    def follow(self, session: str, plan: Plan, state: FollowingPlan) -> None:
        if session:
            self.machine.move(session, plan.environment_id, state)

    def let_go(self, session: str, plan: Plan) -> None:
        if not session:
            return
        try:
            state = self.machine.current(session)
        except NotFound:
            return
        if isinstance(state, FollowingPlan) and state.plan_id == plan.id:
            self.machine.move(session, plan.environment_id, self.machine.states.first())
