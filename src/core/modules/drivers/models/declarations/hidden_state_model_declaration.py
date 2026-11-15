from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.hidden_state import HiddenState


class HiddenStateModelDeclaration(ModelDeclaration):
    """How the module declares AgentFrameSuppression."""

    model = HiddenState
    excluded_subcommands = ["make", "edit", "delete"]
