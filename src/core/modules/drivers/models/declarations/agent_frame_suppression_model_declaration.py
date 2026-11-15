from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.agent_frame_suppression import AgentFrameSuppression


class AgentFrameSuppressionModelDeclaration(ModelDeclaration):
    """How the module declares AgentFrameSuppression."""

    model = AgentFrameSuppression
    excluded_subcommands = ["make", "edit", "delete"]
