from dataclasses import dataclass

from engine.command.command import Command
from engine.profile.agent_profile import AgentProfile


@dataclass(frozen=True)
class SaveProfile(Command[AgentProfile]):
    """A user writes a profile: a new one, or new words for one that exists."""

    lock = False

    profile: AgentProfile
