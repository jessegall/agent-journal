from engine.module.model_declaration import ModelDeclaration
from core.modules.agents.models.agent_fold_row import AgentFoldRow


class AgentFoldRowModelDeclaration(ModelDeclaration):
    """How the module declares AgentFoldRow."""

    model = AgentFoldRow
    excluded_subcommands = ["make", "edit", "delete", "list"]
