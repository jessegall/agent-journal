from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.agent_block import AgentBlock


class AgentBlockModelDeclaration(ModelDeclaration):
    """How the module declares AgentBlock."""

    model = AgentBlock
    excluded_subcommands = ["make", "edit", "delete"]
