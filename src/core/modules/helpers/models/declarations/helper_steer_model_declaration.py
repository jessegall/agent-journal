from engine.module.model_declaration import ModelDeclaration
from core.modules.helpers.models.helper_steer import HelperSteer


class HelperSteerModelDeclaration(ModelDeclaration):
    """How the module declares HelperSteer."""

    model = HelperSteer
    excluded_subcommands = ["make", "edit", "delete"]
