from engine.module.model_declaration import ModelDeclaration
from engine.module.model_declaration import ALL_SUBCOMMANDS
from suites.coding.modules.workers.models.merger_advice import MergerAdvice


class MergerAdviceModelDeclaration(ModelDeclaration):
    """How the module declares MergerAdvice."""

    model = MergerAdvice
    excluded_subcommands = ALL_SUBCOMMANDS
