from engine.module.model_declaration import ModelDeclaration
from engine.module.model_declaration import ALL_SUBCOMMANDS
from suites.coding.modules.workers.models.merger_visit import MergerVisit


class MergerVisitModelDeclaration(ModelDeclaration):
    """How the module declares MergerVisit."""

    model = MergerVisit
    excluded_subcommands = ALL_SUBCOMMANDS
