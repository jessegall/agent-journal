from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.skills.models.agent_skill import AgentSkill


@dataclass(frozen=True)
class RequireSkill(Command[AgentSkill]):
    """Makes a skill due for an agent, unless the agent holds the skill's current text loaded."""

    agent_id: int
    skill: str
