from dataclasses import dataclass

from engine.command.command import Command
from core.modules.skills.models.skill_request import SkillRequest


@dataclass(frozen=True)
class RequestSkill(Command[SkillRequest]):
    """Asks that an agent read a skill; the skills module makes it due once the request is saved."""

    lock = False

    agent_id: int
    skill: str
