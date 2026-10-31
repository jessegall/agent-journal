from dataclasses import dataclass
from enum import StrEnum

from core.base.model.model import Model
from core.base.timestamp import Timestamp


class AgentRole(StrEnum):
    """What an agent session is there for: the main agent of an environment, or a helper it started."""

    MAIN = "main"
    WORKER = "worker"
    SUBAGENT = "subagent"
    REVIEWER = "reviewer"
    VERIFIER = "verifier"


@dataclass(frozen=True, kw_only=True)
class Agent(Model):
    """One session of an agent program in an environment; its id is its actor's id, so the session has one number
    in every row and every event."""

    model_name = "agent"
    cli_name = "agent"

    environment_id: int
    parent_id: int | None = None
    creator_id: int
    session: str
    program: str
    role: AgentRole
    ended_at: Timestamp | None = None
