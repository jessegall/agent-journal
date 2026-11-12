from dataclasses import dataclass

from core.modules.agents.models.agent import Agent
from engine.command.command import Command
from engine.enums.agent_role import AgentRole
from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class StartAgent(Command[Agent]):
    """Starts an agent session in the caller's environment: makes its actor and its agent row under one
    number, with the pid and start time of the agent program's process when the caller knows them. A main
    session of an environment that has a main agent runs on that agent's row. A session that announces itself
    with its first hook says so, and reads as running from then on."""

    session: str
    program: str
    role: str
    parent_id: int | None = None
    pid: int | None = None
    process_started_at: Timestamp | None = None
    program_model: str = ""
    profile: str = ""
    given_name: str = ""
    access: str = "writing"
    is_announced: bool = False

    @property
    def is_main_session(self) -> bool:
        return self.role == AgentRole.MAIN
