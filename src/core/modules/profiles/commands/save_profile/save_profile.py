from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.profiles.support.agent_profile import AgentProfile


@dataclass(frozen=True)
class SaveProfile(Command[AgentProfile]):
    """A person writes a profile: a new one, or new words for one that exists."""

    profile: AgentProfile
