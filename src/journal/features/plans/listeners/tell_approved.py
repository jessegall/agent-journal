from journal.engine.nudger import Nudger
from journal.events.models.updated import Updated
from journal.features.listener import Listener
from journal.models.actor_kind import ActorKind
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink


class TellApproved(Listener[Updated]):
    """The user approved a plan: the live agent is told, so it starts the plan."""

    def __init__(self, nudger: Nudger, agents: Agents, supervisor: SupervisorLink) -> None:
        self.nudger, self.agents, self.supervisor = nudger, agents, supervisor

    def handle(self, event: Updated) -> None:
        from journal.features.plans.feature import Plans as PlansFeature
        plan = event.model
        if not isinstance(plan, Plan) or plan.state != PlanState.APPROVED or event.by.kind != ActorKind.USER:
            return
        agent = self.agents.live()
        if agent is None:
            return
        line = self.nudger.say(agent, PlansFeature.APPROVED.about(n=plan.id))
        if line:
            self.supervisor.type(plan.environment_id, line)
