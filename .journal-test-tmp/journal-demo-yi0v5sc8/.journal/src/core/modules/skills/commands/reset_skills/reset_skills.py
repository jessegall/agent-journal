from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.skills.models.agent_skill import AgentSkill


@dataclass(frozen=True)
class ResetSkills(Command[AgentSkill | None]):
    """Takes away the loaded skills of an agent: a compacted window no longer holds what it read."""

    agent_id: int
