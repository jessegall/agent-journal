from dataclasses import dataclass

from core.modules.agents.agent import Agent, AgentRole
from core.base.command.command import Command


@dataclass(frozen=True)
class AgentStart(Command[Agent]):
    """Starts an agent session in the caller's environment: makes its actor and its agent row under one number."""

    session: str
    program: str
    role: AgentRole
    parent_id: int | None = None
