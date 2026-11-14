from engine.module.model_declaration import ModelDeclaration
from core.modules.skills.models.skill_request import SkillRequest


class SkillRequestModelDeclaration(ModelDeclaration):
    """How the module declares SkillRequest."""

    model = SkillRequest
    excluded_subcommands = ["make", "edit", "show", "list", "delete"]
