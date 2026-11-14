from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.commands.end_worktree_proofs.end_worktree_proofs import ENDED_WITH_WORKTREE_NOTE, EndWorktreeProofs
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES
from suites.coding.modules.workers.queries.proof_query import ProofQuery

WAITING_PROOFS_REASON = "the proofs of one worktree whose tests wait or run are read together"


class EndWorktreeProofsHandler(Handler[EndWorktreeProofs, None]):
    """Ends the queued and running proof tests of a worktree that was abandoned or removed: a running test's
    process is stopped and each proof is sent back short, so no tick waits on a worktree that is gone."""

    command = EndWorktreeProofs
    disabled_scopes = [ActorScope]

    def __init__(self, proofs: ProofQuery, queries: Queries, repository: Repository, bus: Bus) -> None:
        self.proofs, self.queries, self.repository, self.bus = proofs, queries, repository, bus

    def handle(self, command: EndWorktreeProofs, context: Context) -> None:
        waiting = list(self.proofs.worktree_proofs(command.worktree_id).matching(Among("state", TEST_WAITING_STATES)).every_row(WAITING_PROOFS_REASON))
        processes = self.queries.query(Process).find_many([proof.process_id for proof in waiting if proof.process_id is not None])
        for process in processes:
            if process.ended_at is None:
                self.bus.dispatch(StopProcess(process.id), context)
        for proof in waiting:
            self.repository.save_change(proof, proof.ended_with_worktree(ENDED_WITH_WORKTREE_NOTE.format(worktree=command.worktree_id)), context)
