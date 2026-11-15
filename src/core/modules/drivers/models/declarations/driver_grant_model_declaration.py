from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.driver_grant import DriverGrant


class DriverGrantModelDeclaration(ModelDeclaration):
    """How the module declares DriverGrant."""

    model = DriverGrant
    excluded_subcommands = ["make", "edit", "delete"]
