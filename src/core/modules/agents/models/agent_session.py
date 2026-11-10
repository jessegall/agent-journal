from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class AgentSession(EnvironmentScoped, Model):
    """One session an agent ran under: its program and model, when it started, and when and why it ended.
    The end and its reason are empty while the session is the agent's current one. The start is empty for a
    session that replaced another and whose program has not started yet."""

    model_name = "agent_session"
    cli_name = "agent-session"
    shared_rows = True

    environment_id: int = 0
    session_agent_id: int
    session: str
    program: str
    program_model: str = ""
    started_at: Timestamp | None = None
    ended_at: Timestamp | None = None
    end_reason: str = ""
