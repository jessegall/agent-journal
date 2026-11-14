from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.workers.models.merge_followup import MergeFollowup


class MergeFollowupModelDeclaration(ModelDeclaration):
    """How the module declares MergeFollowup."""

    model = MergeFollowup
    excluded_subcommands = ["make", "edit", "delete"]
