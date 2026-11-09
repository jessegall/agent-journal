from typing import Self

from core.base.database.database import Database
from core.base.database.kept_rows import KeptRows
from core.base.model.tables import Tables
from core.base.query.conditions.among import Among
from core.base.query.query import Query
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES, ProofState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.conditions.proof_task_testing import ProofTaskTesting


class ProofQuery(Query[Proof]):
    """Reads proofs, with the proofs of one worktree and those waiting for a check by name."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Proof)
        self.kept = kept

    def worktree_proofs(self, worktree_id: int) -> Self:
        return self.filter(worktree_id=worktree_id)

    def tests_waiting(self, worktree_id: int) -> bool:
        return self.kept.read(self.table.name, self.worktree_proofs(worktree_id).matching(Among("state", TEST_WAITING_STATES)).exists,
                              f"worktree_id = ? AND state IN ({', '.join('?' for _ in TEST_WAITING_STATES)})", [worktree_id, *TEST_WAITING_STATES], name="workers.tests_waiting")

    def has_short_proof(self, worktree_id: int) -> bool:
        return self.kept.read(self.table.name, self.worktree_proofs(worktree_id).filter(state=ProofState.SHORT).exists, "worktree_id = ? AND state = ?", [worktree_id, ProofState.SHORT], name="workers.short_proof")

    def has_waiting_proofs(self, worktree_id: int) -> bool:
        return self.kept.read(self.table.name, self.waiting_proofs(worktree_id).exists, "worktree_id = ? AND state = ?", [worktree_id, ProofState.SHOWN], name="workers.waiting_proofs")

    def untested_proofs(self, worktree_id: int) -> Self:
        return self.waiting_proofs(worktree_id).filter(test_command="")

    def waiting_proofs(self, worktree_id: int) -> Self:
        return self.worktree_proofs(worktree_id).filter(state=ProofState.SHOWN)

    def delivered_proofs(self, worktree_id: int) -> Self:
        return self.waiting_proofs(worktree_id).matching(ProofTaskTesting())

    def test_rows(self) -> tuple[Proof, ...]:
        return self.kept.read(self.table.name, lambda: tuple(self.matching(Among("state", TEST_WAITING_STATES)).oldest().all_rows()),
                              "state IN (?, ?)", list(TEST_WAITING_STATES), name="workers.test_proofs")

    def remember_test(self, proof: Proof) -> None:
        self.kept.update(self.table.name, lambda rows: tuple(sorted([row for row in rows if row.id != proof.id] +
                         ([proof] if proof.state in TEST_WAITING_STATES else []), key=lambda row: row.id)),
                         "state IN (?, ?)", list(TEST_WAITING_STATES), name="workers.test_proofs")

    def remove_test(self, proof: Proof) -> None:
        self.kept.update(self.table.name, lambda rows: tuple(row for row in rows if row.id != proof.id),
                         "state IN (?, ?)", list(TEST_WAITING_STATES), name="workers.test_proofs")
