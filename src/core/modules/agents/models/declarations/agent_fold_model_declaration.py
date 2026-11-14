from engine.module.model_declaration import ModelDeclaration
from core.modules.agents.models.agent_fold import AgentFold


class AgentFoldModelDeclaration(ModelDeclaration):
    """How the module declares AgentFold."""

    model = AgentFold
    excluded_subcommands = ["make", "edit", "delete"]
