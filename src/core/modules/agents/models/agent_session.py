from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.agents.models.enums.stop_reason import StopReason

STOP_CHANGE = "stop"
STOPPING_REASONS = (StopReason.PERSON.value, StopReason.AGENT.value)


@dataclass(frozen=True, kw_only=True)
class AgentSession(EnvironmentScoped, Model):
    """One session an agent ran under: its program and model, when it started, and when and why it ended.
    The end and its reason are empty while the session is the agent's current one. The start is empty for a
    session that replaced another and whose program has not started yet. A session a person or an agent ended
    is a stop."""

    model_name = "agent_session"
    cli_name = "agent-session"
    shared_rows = True
    change_names = (STOP_CHANGE,)

    environment_id: int = 0
    session_agent_id: int
    session: str
    program: str
    program_model: str = ""
    started_at: Timestamp | None = None
    ended_at: Timestamp | None = None
    end_reason: str = ""

    def change_name(self, old_row: Model | None) -> str | None:
        if isinstance(old_row, AgentSession) and old_row.ended_at is None and self.ended_at is not None and self.end_reason in STOPPING_REASONS:
            return STOP_CHANGE
        return None
