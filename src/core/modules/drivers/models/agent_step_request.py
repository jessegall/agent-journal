from dataclasses import dataclass

from engine.model.model import Model
from engine.query.conditions.has_value import HasValue
from engine.query.query import Query
from engine.query.rows.prunable import Prunable
from engine.time.timestamp import Timestamp

REQUESTS_KEPT = 50_000


@dataclass(frozen=True, kw_only=True)
class AgentStepRequest(Prunable, Model):
    """A durable request to step one agent for its causes, written in the transaction of the change that named the
    agent; one open row per agent, served by the step round."""

    kept_rows = REQUESTS_KEPT

    model_name = "agent_step_request"
    cli_name = "agent-step-request"

    session_agent_id: int
    causes: tuple[str, ...] = ()
    attempts: int = 0
    served_at: Timestamp | None = None

    # a request still open is the durable signal of a step, and never pruned
    @classmethod
    def prunable(cls, query: Query["AgentStepRequest"], table: str) -> Query["AgentStepRequest"]:
        return super().prunable(query, table).matching(HasValue("served_at"))
