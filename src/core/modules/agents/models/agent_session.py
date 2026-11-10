from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class AgentSession(EnvironmentScoped, Model):
    """One session an agent ran under: its program and model, when it started, and when and why it ended.
    The end and its reason are empty while the session is the agent's current one."""

    model_name = "agent_session"
    cli_name = "agent-session"

    environment_id: int = 0
    agent_id: int
    session: str
    program: str
    program_model: str = ""
    started_at: Timestamp
    ended_at: Timestamp | None = None
    end_reason: str = ""
