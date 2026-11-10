from engine.change.event_log import EventLog
from engine.command.context import Context
from core.base.database.kept_rows import KeptRows
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_context_read import PlanContextRead


class PlanContextDelivery:
    """Finds actual execution starts and records each agent's successful context read."""

    def __init__(self, events: EventLog, queries: Queries, repository: Repository, kept: KeptRows) -> None:
        self.events, self.queries, self.repository = events, queries, repository
        self.kept = kept

    def start_event(self, plan: Plan) -> int | None:
        event = self.kept.read_newest("plans", lambda: self.events.latest_row("plans", plan.id, ("plan.start", "plan.unblock")),
                                      "id = ?", [plan.id], name="plans.context-start")
        return event.id if event is not None else None

    def has_read(self, plan_id: int, event_id: int, agent_id: int) -> bool:
        return self.kept.read("plan_context_reads",
                              lambda: self.queries.query(PlanContextRead).filter(plan_id=plan_id, start_event_id=event_id, session_agent_id=agent_id).exists(),
                              "plan_id = ? AND start_event_id = ? AND session_agent_id = ?", [plan_id, event_id, agent_id], name="plans.context-read")

    def acknowledge(self, plan: Plan, context: Context) -> None:
        event_id = self.start_event(plan)
        if event_id is not None and not self.has_read(plan.id, event_id, context.actor.id):
            self.repository.save(PlanContextRead(plan_id=plan.id, start_event_id=event_id, session_agent_id=context.actor.id,
                                                creator_id=context.actor.id), context)
