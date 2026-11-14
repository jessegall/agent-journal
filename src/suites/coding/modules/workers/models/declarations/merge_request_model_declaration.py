from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.workers.models.merge_request import MergeRequest


class MergeRequestModelDeclaration(ModelDeclaration):
    """How the module declares MergeRequest."""

    model = MergeRequest
    excluded_subcommands = ["make", "edit", "delete"]
