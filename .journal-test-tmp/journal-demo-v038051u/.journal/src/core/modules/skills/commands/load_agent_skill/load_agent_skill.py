from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.lifecycles.agent_skill_lifecycle import AgentSkillLifecycle


@dataclass(frozen=True)
class LoadAgentSkill(MoveCommand[AgentSkill]):
    move = AgentSkillLifecycle.load
    digest: str
