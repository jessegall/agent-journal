from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.driver_comparison_stack import DriverComparisonStack


class DriverComparisonStackModelDeclaration(ModelDeclaration):
    """How the module declares DriverComparisonStack."""

    model = DriverComparisonStack
    excluded_subcommands = ["make", "edit", "delete"]
