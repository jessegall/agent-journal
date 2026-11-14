from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from suites.coding.modules.workers.commands.report_unstarted_proofs.report_unstarted_proofs import ReportUnstartedProofs
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class UnstartedWorkerProofs:
    """Every minute, has each environment with a queued proof tell the main agent about the proofs that are still
    not started after three minutes, since the tick that starts them may be failing."""

    def __call__(self, container: Container) -> None:
        worktree_environments = {worktree.id: worktree.environment_id for worktree in container.get(WorktreeQuery).all_worktrees()}
        queued = [proof for proof in container.get(ProofQuery).test_rows() if proof.state is ProofState.QUEUED and proof.worktree_id in worktree_environments]
        for environment_id in sorted({worktree_environments[proof.worktree_id] for proof in queued}):
            container.get(Bus).run(ReportUnstartedProofs(), Actor.core(), environment_id=environment_id)
