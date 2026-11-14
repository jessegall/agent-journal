from engine.command.context import Context
from core.modules.agents.models.agent import Agent

CONTEXT_CONTROL_KEY = "context"
PERSON_REASON = "person"


class ContextChangeRequests:
    """Records that an agent's context is to be compacted or cleared, before the line for it is typed. The module
    that keeps those records binds its own and may refuse the request; without one nothing is recorded. A line
    that could not be typed is recorded as the failure of the request it belongs to."""

    def record(self, agent: Agent, change: str, reason: str, line: str, context: Context) -> None:
        return None

    def record_failure(self, agent: Agent, cause: str, context: Context) -> None:
        return None
