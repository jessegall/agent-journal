from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.agent_launch import AgentLaunch


class AgentLaunchModelDeclaration(ModelDeclaration):
    """How the module declares AgentLaunch."""

    model = AgentLaunch
    excluded_subcommands = ["make", "edit", "delete"]
