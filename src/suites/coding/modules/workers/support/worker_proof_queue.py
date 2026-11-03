from core.base.command.context import Context
from core.base.repository.repository import Repository
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.worker_nudges import PROOF_WAITS

PROOF_WAITS_SOURCE = "workers.proof-waits"


class WorkerProofQueue:
    """Queues the test of every proof of a worktree that has not passed, says how many it queued, and tells the
    main agent of the proofs with no test, which wait for its check."""

    def __init__(self, proofs: ProofQuery, repository: Repository, main_agent_line: MainAgentLine) -> None:
        self.proofs, self.repository, self.main_agent_line = proofs, repository, main_agent_line

    def queue(self, worktree: Worktree, context: Context) -> int:
        queued_count = 0
        for proof in tuple(self.proofs.worktree_proofs(worktree.id).oldest().all_rows()):
            if not proof.test_command:
                continue
            if proof.state is ProofState.SHORT:
                proof = self.repository.save(proof.revise(context.timestamp, context.actor, proof.text), context)
            if proof.state is ProofState.SHOWN:
                self.repository.save(proof.moved(ProofLifecycle.queue), context)
                queued_count += 1
        self.send_untested_line(worktree, context)
        return queued_count

    def send_untested_line(self, worktree: Worktree, context: Context) -> None:
        proofs = [str(proof.id) for proof in self.proofs.untested_proofs(worktree.id).oldest().all_rows()]
        if proofs:
            self.main_agent_line.send(worktree.environment_id, PROOF_WAITS.nudge(worker=worktree.agent_id, proofs=" ".join(proofs)).text, PROOF_WAITS_SOURCE, context)
