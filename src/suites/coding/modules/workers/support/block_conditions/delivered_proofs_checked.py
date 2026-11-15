from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition
from suites.coding.modules.workers.queries.proof_query import ProofQuery


class DeliveredProofsChecked(BlockCondition):
    """No proof this worktree delivered waits for its check any more."""

    name = "delivered-proofs-checked"

    def is_true(self, check: BlockCheck) -> bool:
        return not check.container.get(ProofQuery).delivered_proofs(int(self.text)).exists()
