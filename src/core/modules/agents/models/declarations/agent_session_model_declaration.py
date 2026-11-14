from engine.module.model_declaration import ModelDeclaration
from core.modules.agents.models.agent_session import AgentSession


class AgentSessionModelDeclaration(ModelDeclaration):
    """How the module declares AgentSession."""

    model = AgentSession
    excluded_subcommands = ["make", "edit", "delete"]
