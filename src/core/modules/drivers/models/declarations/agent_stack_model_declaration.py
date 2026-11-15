from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.agent_stack import AgentStack


class AgentStackModelDeclaration(ModelDeclaration):
    """How the module declares AgentStack."""

    model = AgentStack
    excluded_subcommands = ["make", "edit", "delete"]
