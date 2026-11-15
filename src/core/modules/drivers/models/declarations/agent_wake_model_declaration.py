from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.agent_wake import AgentWake


class AgentWakeModelDeclaration(ModelDeclaration):
    """How the module declares AgentWake."""

    model = AgentWake
    excluded_subcommands = ["make", "edit", "delete"]
