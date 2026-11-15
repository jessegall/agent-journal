from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.message_sender import MessageSender
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.commands.report_returned_tasks.report_returned_tasks import ReportReturnedTasks
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_job import MERGE_CONFLICT_SOURCE
from suites.coding.modules.workers.agent_messages.worker_phase_tests_failed_message import WorkerPhaseTestsFailedMessage


class ReportReturnedTasksHandler(Handler[ReportReturnedTasks, None]):
    """The proofs of the tasks a worker got back from a failed checkpoint move to its new worktree, so the
    short one is handed in again there, and the worker gets one line with the outputs of the failed tests
    and the commands they ran."""

    command = ReportReturnedTasks
    disabled_scopes = [ActorScope]

    def __init__(self, proofs: ProofQuery, worktrees: WorktreeQuery, repository: Repository, message_sender: MessageSender, guidance: WorkerGuidance, queries: Queries) -> None:
        self.proofs, self.worktrees, self.repository, self.message_sender, self.guidance, self.queries = proofs, worktrees, repository, message_sender, guidance, queries

    def handle(self, command: ReportReturnedTasks, context: Context) -> None:
        returned = command.returned
        worktree = self.worktrees.required_worker_worktree(returned.worker_id)
        for proof in self.proofs.task_proofs(returned.task_ids):
            self.repository.save_change(proof, proof.returned(worktree.id), context)
        outputs = ", ".join(str(output_id) for output_id in returned.output_ids)
        failed = "; ".join(process.line for process in self.queries.query(Process).find_many(list(returned.output_ids)))
        self.message_sender.send(returned.worker_id, WorkerPhaseTestsFailedMessage.declared(), MERGE_CONFLICT_SOURCE, context, phase=command.phase_id, outputs=outputs, line=self.guidance.line(returned.worker_id), failed=failed)
