from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck


class WorktreeBehindCheckModelDeclaration(ModelDeclaration):
    """How the module declares WorktreeBehindCheck."""

    model = WorktreeBehindCheck
    excluded_subcommands = ["make", "edit", "delete", "list"]
