from core.base.change.event_log import EventLog
from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_context_read import PlanContextRead


class PlanContextDelivery:
    """Finds actual execution starts and records each agent's successful context read."""

    def __init__(self, events: EventLog, queries: Queries, repository: Repository) -> None:
        self.events, self.queries, self.repository = events, queries, repository

    def start_event(self, plan: Plan) -> int | None:
        event = self.events.newest_row_named("plans", plan.id, ("plan.start", "plan.unblock"))
        return event.id if event is not None else None

    def has_read(self, plan_id: int, event_id: int, agent_id: int) -> bool:
        return self.queries.query(PlanContextRead).filter(plan_id=plan_id, start_event_id=event_id, session_agent_id=agent_id).exists()

    def acknowledge(self, plan: Plan, context: Context) -> None:
        event_id = self.start_event(plan)
        if event_id is not None and not self.has_read(plan.id, event_id, context.actor.id):
            self.repository.save(PlanContextRead(plan_id=plan.id, start_event_id=event_id, session_agent_id=context.actor.id,
                                                creator_id=context.actor.id, environment_id=plan.environment_id), context)
