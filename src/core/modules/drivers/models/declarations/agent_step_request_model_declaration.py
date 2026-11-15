from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.agent_step_request import AgentStepRequest


class AgentStepRequestModelDeclaration(ModelDeclaration):
    """How the module declares AgentStepRequest."""

    model = AgentStepRequest
    excluded_subcommands = ["make", "edit", "delete"]
    is_bookkeeping = True
