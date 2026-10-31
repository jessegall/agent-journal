from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class SkillRequest(Model):
    """Another module's request that an agent read a skill, which the skills module makes due when the skill is
    one it knows."""

    model_name = "skill_request"
    cli_name = "skill-request"

    agent_id: int
    creator_id: int
    skill: str
