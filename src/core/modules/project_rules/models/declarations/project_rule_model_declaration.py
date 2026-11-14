from engine.module.model_declaration import ModelDeclaration
from core.modules.project_rules.models.project_rule import ProjectRule


class ProjectRuleModelDeclaration(ModelDeclaration):
    """How the module declares ProjectRule."""

    model = ProjectRule
    excluded_subcommands = ["make"]
