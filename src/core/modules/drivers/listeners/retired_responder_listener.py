from engine.command.context import Context
from engine.enums.responder import Responder
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_escalation import AgentEscalation
from core.modules.drivers.models.enums.escalation_state import EscalationState

CHILD_AGENTS_REASON = "the agents a retired agent started, a handful"
OPEN_ESCALATIONS_REASON = "the open escalations of a retired agent's children, one each at most"


class RetiredResponderListener(SaveListener[Changed[Agent]]):
    """A parent that retires can no longer answer, so the open escalations it answers pass to the person in the
    retirement's write (doc 1310 section 4.6)."""

    name = "drivers.retired-responder"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Changed[Agent], context: Context) -> None:
        if event.old_row is None or event.old_row.retired_at is not None or event.row.retired_at is None:
            return
        children = [child.id for child in self.queries.query(Agent).filter(parent_id=event.row.id).every_row(CHILD_AGENTS_REASON)]
        if not children:
            return
        escalations = self.queries.query(AgentEscalation).filter(state=EscalationState.OPEN, responder=Responder.PARENT).matching(
            Among("session_agent_id", children)).every_row(OPEN_ESCALATIONS_REASON)
        for escalation in escalations:
            self.repository.save(escalation.changed(responder=Responder.PERSON), context)
