from argparse import Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.models.agent_escalation import AgentEscalation
from core.modules.drivers.models.enums.escalation_state import EscalationState

OPEN_ESCALATIONS_REASON = "open escalations are few: each waits for one answer"


class EscalationListSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal escalation list`: the open escalations, each with its agent, what reached its limit and who
    was asked."""

    cli_name = "escalation"
    name = "list"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        rows = self.queries.query(AgentEscalation).filter(state=EscalationState.OPEN).every_row(OPEN_ESCALATIONS_REASON)
        return tuple(f"{row.id} agent {row.session_agent_id}: {row.refusal_count} {row.escalation_type} refused, {row.responder} asked" for row in rows) or ("no escalation is open",)
