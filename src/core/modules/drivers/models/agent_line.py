from engine.model.prunable import Prunable
from engine.query.conditions.among import Among
from dataclasses import dataclass

from engine.model.model import Model
from engine.model.session_private import SessionPrivate
from engine.time.timestamp import Timestamp
from engine.driver.nudge import Nudge
from core.modules.drivers.models.support.agent_line_nudge import AGENT_LINE_AVAILABLE
from engine.driver.nudge_declaration import NudgeDeclaration
from core.modules.drivers.models.lifecycles.agent_line_lifecycle import AgentLineLifecycle
from core.modules.drivers.models.enums.agent_line_state import AgentLineState

PRUNABLE_LINE_STATES = (AgentLineState.DELIVERED, AgentLineState.ENTERED, AgentLineState.HIDDEN)


@dataclass(frozen=True, kw_only=True)
class AgentLine(Prunable, SessionPrivate, Model):
    """A line the journal has for an agent, kept as a row until a hook gives it or the server types it, with
    the rule or listener that wrote it."""

    kept_rows = 20000

    hidden_state = AgentLineState.HIDDEN
    model_name = "agent_line"
    cli_name = "agent-line"
    hidden_fields = frozenset(["nudge_json"])
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
    nudge_json: str | None = None

    @property
    def nudge(self) -> Nudge:
        if self.nudge_json is None:
            return AGENT_LINE_AVAILABLE.nudge(line=self.id)
        return NudgeDeclaration.restore(self.nudge_json)

    @classmethod
    def prunable(cls, query, table):
        return super().prunable(query, table).matching(Among("state", PRUNABLE_LINE_STATES))
