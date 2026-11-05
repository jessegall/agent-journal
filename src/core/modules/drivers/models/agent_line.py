from dataclasses import dataclass, replace

from core.base.model.model import Model
from core.base.model.session_private import SessionPrivate
from core.base.timestamp import Timestamp
from core.modules.drivers.models.lifecycles.agent_line_lifecycle import AgentLineLifecycle
from core.modules.drivers.models.enums.agent_line_state import AgentLineState


@dataclass(frozen=True, kw_only=True)
class AgentLine(SessionPrivate, Model):
    """A line the journal has for an agent, kept as a row until a hook gives it or the server types it, with
    the rule or listener that wrote it."""

    hidden_state = AgentLineState.HIDDEN
    model_name = "agent_line"
    cli_name = "agent-line"
    lifecycle = AgentLineLifecycle

    session_agent_id: int
    hook_call_id: int | None = None
    creator_id: int
    text: str
    source: str = ""
    wakes_agent: bool = False
    repeats_without_hook: bool = False
    state: AgentLineState = AgentLineState.WAITING
    delivered_at: Timestamp | None = None

