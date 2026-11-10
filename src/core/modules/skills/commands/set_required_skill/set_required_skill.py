from dataclasses import dataclass

from engine.command.command import Command
from core.modules.skills.support.required_agents import RequiredAgents
from core.modules.skills.support.skill_requirements import SkillRequirements


@dataclass(frozen=True)
class SetRequiredSkill(Command[SkillRequirements]):
    """Changes the project start requirements for one skill."""

    skill: str
    agents: RequiredAgents
    after_compaction: bool
