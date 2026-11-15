from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.driver_version import DriverVersion


class DriverVersionModelDeclaration(ModelDeclaration):
    """How the module declares DriverEpoch."""

    model = DriverVersion
    excluded_subcommands = ["make", "edit", "delete"]
