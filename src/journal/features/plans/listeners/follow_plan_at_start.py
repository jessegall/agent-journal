from dataclasses import replace

from journal.engine.state_machine import StateMachine
from journal.engine.states.paused import Paused
from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.features.plans.states.following_plan import FollowingPlan
from journal.models.plan_state import PlanState
from journal.models.task_state import TaskState
from journal.repositories.plans import Plans


class FollowPlanAtStart(AgentListener[SessionStarted]):
    """A session that starts at rest while a plan is started here follows that plan, with its task in hand when one is started, else standing where the plan stands."""

    blocking = True

    def __init__(self, machine: StateMachine, plans: Plans) -> None:
        self.machine, self.plans = machine, plans

    def handle(self, event: SessionStarted) -> None:
        current = self.machine.current(event.session)
        first = self.machine.states.first().name
        at_rest = current.name == first or (isinstance(current, Paused) and current.resume.get("state", first) == first)
        plan = next((p for p in self.plans.in_() if p.state == PlanState.STARTED), None)
        if not at_rest or plan is None:
            return
        started = next((t for t in self.plans.tasks_of(plan) if t.state == TaskState.STARTED), None)
        following = FollowingPlan(plan_id=plan.id, task_id=started.id if started else 0)
        if isinstance(current, Paused):
            self.machine.move(event.session, event.environment_id, replace(current, resume={"state": following.name, "data": following.to_data()}))
        else:
            self.machine.move(event.session, event.environment_id, following)
