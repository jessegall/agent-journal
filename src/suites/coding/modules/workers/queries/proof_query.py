from collections.abc import Sequence
from typing import Self

from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.model.tables import Tables
from engine.query.conditions.among import Among
from engine.query.query import Query
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES, ProofState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.replaced_rows import replaced_rows
from suites.coding.modules.workers.conditions.proof_task_testing import ProofTaskTesting

PROOF_PAGE_ROWS = 50


class ProofQuery(Query[Proof]):
    """Reads proofs, with the proofs of one worktree and those waiting for a check by name. The proofs of a task
    are those of the newest worktree that proved each point: a proof an older worktree made for the same point is
    replaced, so a short one there no longer fails a checkpoint."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Proof)
        self.kept = kept

    def worktree_proofs(self, worktree_id: int) -> Self:
        return self.filter(worktree_id=worktree_id)

    def worktree_rows(self, worktree_id: int) -> tuple[Proof, ...]:
        return self.kept.read(self.table.name, lambda: tuple(self.worktree_proofs(worktree_id).all_rows()), "worktree_id = ?", [worktree_id], name="workers.worktree_proofs")

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

    def task_proofs(self, task_ids: Sequence[int]) -> tuple[Proof, ...]:
        proofs = self.matching(Among("task_id", task_ids)).oldest().all_rows(PROOF_PAGE_ROWS)
        current = {(proof.task_id, proof.point): proof for proof in sorted(proofs, key=lambda proof: (proof.worktree_id, proof.id))}
        return tuple(sorted(current.values(), key=lambda proof: proof.id))

    def committed_proofs(self, task_ids: Sequence[int]) -> Self:
        return self.filter(state=ProofState.COMMITTED).matching(Among("task_id", task_ids))

    def delivered_proofs(self, worktree_id: int) -> Self:
        return self.waiting_proofs(worktree_id).matching(ProofTaskTesting())

    def test_rows(self) -> tuple[Proof, ...]:
        return self.kept.read(self.table.name, lambda: tuple(self.matching(Among("state", TEST_WAITING_STATES)).oldest().all_rows()),
                              "state IN (?, ?)", list(TEST_WAITING_STATES), name="workers.test_proofs")

    def remember_test(self, proof: Proof) -> None:
        def with_proof(rows: tuple[Proof, ...]) -> tuple[Proof, ...]:
            return replaced_rows(rows, proof.id, [proof] if proof.state in TEST_WAITING_STATES else [])

        self.kept.update(self.table.name, with_proof, "state IN (?, ?)", list(TEST_WAITING_STATES), name="workers.test_proofs")

    def remove_test(self, proof: Proof) -> None:
        def without_proof(rows: tuple[Proof, ...]) -> tuple[Proof, ...]:
            return replaced_rows(rows, proof.id, [])

        self.kept.update(self.table.name, without_proof, "state IN (?, ?)", list(TEST_WAITING_STATES), name="workers.test_proofs")
