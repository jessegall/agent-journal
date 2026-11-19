from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from suites.coding.modules.workers.commands.queue_worker_tests.start_worker_tests import StartWorkerTests
from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.models.enums.affected_test_state import AffectedTestState
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_test_plan import PickerRun, ProofRun
from suites.coding.modules.workers.support.worker_test_start import WorkerTestStart


class StartWorkerTestsHandler(Handler[StartWorkerTests, None]):
    """Moves the planned queued proofs to running and makes their processes, owned by the worker that wrote them,
    so it reads their output; a later listener starts them once this is committed. A proof or a first answer that
    moved on after the plan was made is left as it is."""

    runs_once = True
    command = StartWorkerTests

    def __init__(self, rows: EventRows, repository: Repository, bus: Bus) -> None:
        self.rows, self.repository, self.bus = rows, repository, bus

    def handle(self, command: StartWorkerTests, context: Context) -> None:
        for proof_run in command.plan.proof_runs:
            self.start_proofs(proof_run, context)
        for picker_run in command.plan.picker_runs:
            self.start_picker(picker_run, context)
        for cancelled_id in command.plan.cancelled_ids:
            first_answer = self.rows.required(AffectedTest, cancelled_id)
            if first_answer.state is AffectedTestState.QUEUED:
                self.repository.update(first_answer, context, state=AffectedTestState.CANCELLED)

    def start_proofs(self, proof_run: ProofRun, context: Context) -> None:
        proofs = [self.rows.required(Proof, proof_id) for proof_id in proof_run.proof_ids]
        if any(proof.state is not ProofState.QUEUED for proof in proofs):
            return
        worktree = self.rows.required(Worktree, proofs[0].worktree_id)
        start = WorkerTestStart.started(worktree.session_agent_id, proof_run.command, proof_run.folder)
        process = self.bus.dispatch(replace(start, owner_agent_id=worktree.session_agent_id, task_id=proofs[0].task_id), context)
        for proof in proofs:
            self.repository.save_change(proof, proof.moved(ProofLifecycle.run, process_id=process.id), context)

    def start_picker(self, picker_run: PickerRun, context: Context) -> None:
        first_answer = self.rows.required(AffectedTest, picker_run.affected_test_id)
        if first_answer.state is not AffectedTestState.QUEUED:
            return
        worktree = self.rows.required(Worktree, first_answer.worktree_id)
        start = WorkerTestStart.started(worktree.session_agent_id, first_answer.picker_command, picker_run.folder)
        process = self.bus.dispatch(replace(start, owner_agent_id=worktree.session_agent_id, task_id=first_answer.task_id), context)
        self.repository.update(first_answer, context, state=AffectedTestState.PICKING, process_id=process.id)
