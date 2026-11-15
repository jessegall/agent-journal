from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.driver_table import DriverTable


class DriverTableModelDeclaration(ModelDeclaration):
    """How the module declares DriverTable."""

    model = DriverTable
    excluded_subcommands = ["make", "edit", "delete"]
