from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudger import Nudger
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.report_returned_tasks.report_returned_tasks import ReportReturnedTasks
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_job import MERGE_CONFLICT_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_PHASE_TESTS_FAILED


class ReportReturnedTasksHandler(Handler[ReportReturnedTasks, None]):
    """The proofs of the tasks a worker got back from a failed checkpoint move to its new worktree, so the
    short one is handed in again there, and the worker gets one line with the outputs of the failed tests."""

    command = ReportReturnedTasks
    disabled_scopes = [ActorScope]

    def __init__(self, proofs: ProofQuery, worktrees: WorktreeQuery, repository: Repository, nudger: Nudger, guidance: WorkerGuidance) -> None:
        self.proofs, self.worktrees, self.repository, self.nudger, self.guidance = proofs, worktrees, repository, nudger, guidance

    def handle(self, command: ReportReturnedTasks, context: Context) -> None:
        returned = command.returned
        worktree = self.worktrees.required_worker_worktree(returned.worker_id)
        for proof in self.proofs.task_proofs(returned.task_ids):
            self.repository.save_change(proof, proof.returned(worktree.id), context)
        outputs = ", ".join(str(output_id) for output_id in returned.output_ids)
        self.nudger.send(returned.worker_id, WORKER_PHASE_TESTS_FAILED, MERGE_CONFLICT_SOURCE, context, phase=command.phase_id, outputs=outputs, line=self.guidance.line(returned.worker_id))
