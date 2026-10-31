from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.drivers.models.lifecycles.agent_line_lifecycle import AgentLineLifecycle
from core.modules.drivers.models.enums.agent_line_state import AgentLineState


@dataclass(frozen=True, kw_only=True)
class AgentLine(Model):
    """A line the journal has for an agent, kept as a row until a hook gives it or the server types it, with the
    rule or listener that wrote it."""

    model_name = "agent_line"
    cli_name = "agent-line"
    lifecycle = AgentLineLifecycle

    agent_id: int
    hook_call_id: int | None = None
    creator_id: int
    text: str
    source: str = ""
    state: AgentLineState = AgentLineState.WAITING
    delivered_at: Timestamp | None = None
