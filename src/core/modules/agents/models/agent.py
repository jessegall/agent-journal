from dataclasses import dataclass
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.base.agent_role import AgentRole

AGENTS_TABLE = "agents"
ENDED_FIELD = "ended_at"


@dataclass(frozen=True, kw_only=True)
class Agent(Model):
    """One session of an agent program in an environment; its id is its actor's id, so the session has one
    number in every row and every event. The pid and start time of the agent program's process identify it
    among a command's ancestor processes while the session is open."""

    model_name = "agent"
    cli_name = "agent"
    search_fields = ["given_name", "program", "program_model", "profile", "session"]

    environment_id: int
    parent_id: int | None = None
    creator_id: int
    session: str
    program: str
    role: AgentRole
    pid: int | None = None
    process_started_at: Timestamp | None = None
    launch_agent_id: int | None = None
    paused_at: Timestamp | None = None
    program_model: str = ""
    profile: str = ""
    given_name: str = ""
    ended_at: Timestamp | None = None

    def ended(self, timestamp: Timestamp) -> "Agent":
        return self.changed(ended_at=timestamp, paused_at=None)

    @property
    def terminal_id(self) -> int:
        return self.launch_agent_id if self.launch_agent_id is not None else self.id
