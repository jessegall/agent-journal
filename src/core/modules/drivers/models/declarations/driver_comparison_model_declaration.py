from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.driver_comparison import DriverComparison


class DriverComparisonModelDeclaration(ModelDeclaration):
    """How the module declares DriverComparison."""

    model = DriverComparison
    excluded_subcommands = ["make", "edit", "delete"]
