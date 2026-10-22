from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent

USAGE_LIMIT_ERROR = "rate_limit"


@dataclass(frozen=True)
class TurnFailed(AgentEvent):
    """The agent's turn ended on an error of its provider's, such as the usage limit, instead of on its own words."""

    is_turn_end = True

    error: str = ""
    message: str = ""

    def is_usage_limit(self) -> bool:
        return self.error == USAGE_LIMIT_ERROR
