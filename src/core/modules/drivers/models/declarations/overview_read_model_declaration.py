from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.overview_read import OverviewRead


class OverviewReadModelDeclaration(ModelDeclaration):
    """How the module declares OverviewRead."""

    model = OverviewRead
    excluded_subcommands = ["make", "edit", "delete"]
