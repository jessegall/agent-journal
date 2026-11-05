from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.skills.models.skill_request import SkillRequest


@dataclass(frozen=True)
class RequestSkill(Command[SkillRequest]):
    """Asks that an agent read a skill; the skills module makes it due once the request is saved."""

    agent_id: int
    skill: str
