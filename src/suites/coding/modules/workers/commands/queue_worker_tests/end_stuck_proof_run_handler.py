from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.commands.queue_worker_tests.end_stuck_proof_run import STUCK_RUN_NOTE, EndStuckProofRun
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test import RecordWorkerTest
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_nudges import PROOF_RUN_STUCK

LINE_SOURCE = "workers"


class EndStuckProofRunHandler(Handler[EndStuckProofRun, None]):
    """Stops the process of a proof's test run that is still going, records the proof as failed, which sends the
    worker back to its tests, and tells the merger, or the main agent when no merger is on."""

    command = EndStuckProofRun
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, bus: Bus, inbox: MergerInbox, numbers: RowNumbers) -> None:
        self.rows, self.bus, self.inbox, self.numbers = rows, bus, inbox, numbers

    def handle(self, command: EndStuckProofRun, context: Context) -> None:
        proof = self.rows.required(Proof, command.proof_id)
        process = self.rows.find(Process, proof.process_id) if proof.process_id is not None else None
        if process is not None and process.ended_at is None:
            self.bus.dispatch(StopProcess(process.id), context)
        self.bus.dispatch(RecordWorkerTest(proof.id, False, STUCK_RUN_NOTE.format(minutes=command.minutes, process=proof.process_id)), context)
        worktree = self.rows.required(Worktree, proof.worktree_id)
        worker = self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)
        self.inbox.send_nudge(PROOF_RUN_STUCK.nudge(worker=worker, proof=proof.id, minutes=command.minutes, output=proof.process_id), LINE_SOURCE, context)
