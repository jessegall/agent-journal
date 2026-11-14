from engine.module.model_declaration import ModelDeclaration
from engine.module.model_declaration import ALL_SUBCOMMANDS
from suites.coding.modules.workers.models.worktree_stale_check_time import WorktreeStaleCheckTime


class WorktreeStaleCheckTimeModelDeclaration(ModelDeclaration):
    """How the module declares WorktreeStaleCheckTime."""

    model = WorktreeStaleCheckTime
    excluded_subcommands = ALL_SUBCOMMANDS
