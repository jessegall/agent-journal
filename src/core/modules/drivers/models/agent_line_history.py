from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class AgentLineHistory(Model):
    """When one line source last told one agent a line, which its interval and its turns are counted from."""

    model_name = "agent_line_history"
    cli_name = "agent-line-history"

    session_agent_id: int
    source_key: str
    last_given_at: Timestamp
