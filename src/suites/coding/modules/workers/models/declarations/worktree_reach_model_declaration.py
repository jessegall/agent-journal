from engine.module.model_declaration import ModelDeclaration
from engine.module.model_declaration import ALL_SUBCOMMANDS
from suites.coding.modules.workers.models.worktree_reach import WorktreeReach


class WorktreeReachModelDeclaration(ModelDeclaration):
    """How the module declares WorktreeReach."""

    model = WorktreeReach
    excluded_subcommands = ALL_SUBCOMMANDS
