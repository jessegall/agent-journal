from dataclasses import dataclass
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.agents.agent_role import AgentRole


@dataclass(frozen=True, kw_only=True)
class Agent(Model):
    """One session of an agent program in an environment; its id is its actor's id, so the session has one
    number in every row and every event. The pid and start time of the agent program's process identify it
    among a command's ancestor processes while the session is open."""

    model_name = "agent"
    cli_name = "agent"

    environment_id: int
    parent_id: int | None = None
    creator_id: int
    session: str
    program: str
    role: AgentRole
    pid: int | None = None
    process_started_at: Timestamp | None = None
    ended_at: Timestamp | None = None
