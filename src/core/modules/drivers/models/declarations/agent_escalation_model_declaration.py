from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.agent_escalation import AgentEscalation


class AgentEscalationModelDeclaration(ModelDeclaration):
    """How the module declares AgentEscalation."""

    model = AgentEscalation
    excluded_subcommands = ["make", "edit", "delete"]
