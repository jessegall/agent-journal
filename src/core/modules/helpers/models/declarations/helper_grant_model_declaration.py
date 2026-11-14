from engine.module.model_declaration import ModelDeclaration
from core.modules.helpers.models.helper_grant import HelperGrant


class HelperGrantModelDeclaration(ModelDeclaration):
    """How the module declares HelperGrant."""

    model = HelperGrant
    excluded_subcommands = ["make", "edit", "delete"]
