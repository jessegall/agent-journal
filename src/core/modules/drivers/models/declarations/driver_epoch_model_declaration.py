from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.driver_epoch import DriverEpoch


class DriverEpochModelDeclaration(ModelDeclaration):
    """How the module declares DriverEpoch."""

    model = DriverEpoch
    excluded_subcommands = ["make", "edit", "delete"]
