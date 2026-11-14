from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.workers.models.merger_line import MergerLine


class MergerLineModelDeclaration(ModelDeclaration):
    """How the module declares MergerLine."""

    model = MergerLine
    excluded_subcommands = ["make", "edit", "delete"]
