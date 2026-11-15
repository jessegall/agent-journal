from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.agent_subject import AgentSubject


class AgentSubjectModelDeclaration(ModelDeclaration):
    """How the module declares AgentSubject."""

    model = AgentSubject
    excluded_subcommands = ["make", "edit", "delete"]
