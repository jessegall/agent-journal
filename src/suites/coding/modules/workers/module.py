from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from suites.coding.modules.workers.migrations.m001_workers import WorkersTables
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.proof_query import ProofQuery
from suites.coding.modules.workers.proof_short import ProofShort
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.worktree_query import WorktreeQuery

WORKTREE_MOVES = [move.name for move in WorktreeLifecycle.moves()]


class WorkersModule(Module):
    """Adds the coding suite's workers: the worktree each one writes in and the proofs it shows for its task."""

    name = "journal.suites.coding.workers"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents", "journal.core.tasks", "journal.core.environments", "journal.core.settings", "journal.core.drivers"]
    models = [ModelDeclaration(Worktree, query=WorktreeQuery, excluded_subcommands=["make", "edit", "delete", *WORKTREE_MOVES]),
              ModelDeclaration(Proof, query=ProofQuery, commands=[ProofShort], excluded_subcommands=["make", "edit", "delete", "revise"])]
    migrations = [WorkersTables]
