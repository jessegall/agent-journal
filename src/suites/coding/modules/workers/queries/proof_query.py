from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.proof import Proof


class ProofQuery(Query[Proof]):
    """Reads proofs, with the proofs of one worktree and those waiting for a check by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Proof)

    def worktree_proofs(self, worktree_id: int) -> Self:
        return self.filter(worktree_id=worktree_id)

    def waiting_proofs(self, worktree_id: int) -> Self:
        return self.worktree_proofs(worktree_id).filter(state=ProofState.SHOWN)
