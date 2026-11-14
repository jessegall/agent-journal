from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.workers.models.merge_ask import MergeAsk


class MergeAskModelDeclaration(ModelDeclaration):
    """How the module declares MergeAsk."""

    model = MergeAsk
    excluded_subcommands = ["make", "edit", "delete", "merge", "reject"]
