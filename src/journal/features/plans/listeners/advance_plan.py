from dataclasses import replace
from datetime import datetime, timezone

from journal.engine.machine import Machine
from journal.engine.agent_state import AgentState
from journal.engine.states.paused import Paused
from journal.events.models.updated import Updated
from journal.events.listener import Listener
from journal.features.plans.support.plan_control import PlanControl
from journal.features.plans.states.following_plan import FollowingPlan
from journal.models.plan_state import PlanState
from journal.models.task import Task
from journal.repositories.agents import Agents
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks


class AdvancePlan(Listener[Updated]):
    """A plan is done when its last task closes, whoever closes it. The agent following the plan with that task in hand, whoever closed it, goes on: to the next open task, which is started for it; at a checkpoint's end it keeps following the plan with no task in hand, the workflows saying what the mode makes of it; when no task can start, it is told which wait; a plan no longer started lets it go. A paused agent keeps its pause and goes on when it ends."""

    def __init__(self, machine: Machine, plans: Plans, tasks: Tasks, agents: Agents, control: PlanControl) -> None:
        self.machine, self.plans, self.tasks, self.agents, self.control = machine, plans, tasks, agents, control

    def handle(self, event: Updated) -> None:
        from journal.features.plans.feature import Plans as PlansFeature
        task = event.model
        if not isinstance(task, Task) or not task.has_just_closed(event.was):
            return
        for plan in [p for p in self.plans.holding(task) if self.plans.finished(p)]:
            self.plans.save(plan.done(), event.by)
            print(PlansFeature.PLAN_DONE.create(n=plan.id).rendered())
        follower = self.follower(task)
        if follower is None:
            return
        session, state = follower
        plan = self.plans.find(state.plan_id)
        if plan.state != PlanState.STARTED:
            self.moved(session, task, self.machine.states.first())
            return
        if self.control.holds(plan):
            self.moved(session, task, FollowingPlan(plan_id=plan.id, moved_from=task.id))
            return
        following = self.plans.next_task(plan)
        if following is None:
            self.moved(session, task, FollowingPlan(plan_id=plan.id, moved_from=task.id))
            return
        if self.tasks.in_hand() is not None:
            self.moved(session, task, FollowingPlan(plan_id=plan.id, moved_from=task.id))
            return
        started = self.tasks.save(following.started(datetime.now(timezone.utc)), event.by)
        self.moved(session, task, FollowingPlan(plan_id=plan.id, task_id=started.id, moved_from=task.id))

    def follower(self, task: Task) -> tuple[str, FollowingPlan] | None:
        """The session following a plan with this task in hand, now or once its pause ends."""
        for agent in self.agents.in_():
            state = self.machine.current(agent.session)
            resumed = self.machine.states.resumed(state) if isinstance(state, Paused) else state
            if isinstance(resumed, FollowingPlan) and resumed.task_id == task.id:
                return agent.session, resumed
        return None

    def moved(self, session: str, task: Task, to: AgentState) -> None:
        """The agent moved on; one paused keeps its pause and goes on to this once it ends."""
        current = self.machine.current(session)
        if isinstance(current, Paused):
            self.machine.move(session, task.environment_id, replace(current, resume={"state": to.name, "data": to.to_data()}))
            return
        self.machine.move(session, task.environment_id, to)
