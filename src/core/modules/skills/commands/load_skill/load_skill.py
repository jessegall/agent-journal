from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.skills.models.agent_skill import AgentSkill


@dataclass(frozen=True)
class LoadSkill(Command[AgentSkill]):
    """Marks a skill loaded for an agent, with the digest of the text it read."""

    agent_id: int
    skill: str
    digest: str
