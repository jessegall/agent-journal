from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.agent_stack_move import AgentStackMove


class AgentStackMoveModelDeclaration(ModelDeclaration):
    """How the module declares AgentStackMove."""

    model = AgentStackMove
    excluded_subcommands = ["make", "edit", "delete"]
