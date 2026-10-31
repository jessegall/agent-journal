from dataclasses import dataclass

from core.modules.agents.agent import Agent
from core.modules.agents.agent_role import AgentRole
from core.base.command.command import Command
from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class AgentStart(Command[Agent]):
    """Starts an agent session in the caller's environment: makes its actor and its agent row under one number, with
    the pid and start time of the agent program's process when the caller knows them."""

    session: str
    program: str
    role: AgentRole
    parent_id: int | None = None
    pid: int | None = None
    process_started_at: Timestamp | None = None
