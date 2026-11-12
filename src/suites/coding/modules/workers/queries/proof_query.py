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

PROOFS_REASON = "every proof of the worktree or tasks asked about counts"

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
        proofs = self.worktree_proofs(worktree_id)
        return self.kept.read(proofs, lambda: tuple(proofs.every_row(PROOFS_REASON)), name="workers.worktree_proofs")

    def tests_waiting(self, worktree_id: int) -> bool:
        proofs = self.worktree_proofs(worktree_id).matching(Among("state", TEST_WAITING_STATES))
        return self.kept.read(proofs, proofs.exists, name="workers.tests_waiting")

    def has_short_proof(self, worktree_id: int) -> bool:
        proofs = self.worktree_proofs(worktree_id).filter(state=ProofState.SHORT)
        return self.kept.read(proofs, proofs.exists, name="workers.short_proof")

    def has_waiting_proofs(self, worktree_id: int) -> bool:
        proofs = self.waiting_proofs(worktree_id)
        return self.kept.read(proofs, proofs.exists, name="workers.waiting_proofs")

    def untested_proofs(self, worktree_id: int) -> Self:
        return self.waiting_proofs(worktree_id).filter(test_command="")

    def waiting_proofs(self, worktree_id: int) -> Self:
        return self.worktree_proofs(worktree_id).filter(state=ProofState.SHOWN)

    def task_proofs(self, task_ids: Sequence[int]) -> tuple[Proof, ...]:
        proofs = self.matching(Among("task_id", task_ids)).every_row(PROOFS_REASON)
        current = {(proof.task_id, proof.point): proof for proof in sorted(proofs, key=lambda proof: (proof.worktree_id, proof.id))}
        return tuple(sorted(current.values(), key=lambda proof: proof.id))

    def committed_proofs(self, task_ids: Sequence[int]) -> Self:
        return self.filter(state=ProofState.COMMITTED).matching(Among("task_id", task_ids))

    def delivered_proofs(self, worktree_id: int) -> Self:
        return self.waiting_proofs(worktree_id).matching(ProofTaskTesting())

    def test_rows(self) -> tuple[Proof, ...]:
        proofs = self.test_waiting()
        return self.kept.read(proofs, lambda: tuple(proofs.every_row(PROOFS_REASON)), name="workers.test_proofs")

    def test_waiting(self) -> Self:
        return self.matching(Among("state", TEST_WAITING_STATES)).oldest()

    def remember_test(self, proof: Proof) -> None:
        def with_proof(rows: tuple[Proof, ...]) -> tuple[Proof, ...]:
            return replaced_rows(rows, proof.id, [proof] if proof.state in TEST_WAITING_STATES else [])

        self.kept.update(self.test_waiting(), with_proof, name="workers.test_proofs")

    def remove_test(self, proof: Proof) -> None:
        def without_proof(rows: tuple[Proof, ...]) -> tuple[Proof, ...]:
            return replaced_rows(rows, proof.id, [])

        self.kept.update(self.test_waiting(), without_proof, name="workers.test_proofs")
