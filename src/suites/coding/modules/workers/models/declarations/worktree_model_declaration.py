from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorktreeModelDeclaration(ModelDeclaration):
    """How the module declares Worktree."""

    model = Worktree
    query = WorktreeQuery
    excluded_subcommands = ["make", "edit", "delete", *[move.name for move in WorktreeLifecycle.moves()]]
