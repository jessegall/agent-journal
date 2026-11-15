from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.agent_line_history import AgentLineHistory


class AgentLineHistoryModelDeclaration(ModelDeclaration):
    """How the module declares AgentLineHistory."""

    model = AgentLineHistory
    excluded_subcommands = ["make", "edit", "delete"]
