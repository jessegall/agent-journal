from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.merge_worker.merge_worker import MergeWorker
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.commands.merge_next_worker.merge_next_worker import MergeNextWorker
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report import SendMergerReport
from suites.coding.modules.workers.support.merger_nudges import MERGER_MERGED
from suites.coding.modules.workers.queries.worker_operation_query import WorkerOperationQuery


class MergeNextWorkerHandler(Handler[MergeNextWorker, MergeOutcome]):
    """Merges a worker after the merger reviews its logs."""

    command = MergeNextWorker

    def __init__(self, agents: AgentRows, bus: Bus, operations: WorkerOperationQuery) -> None:
        self.agents, self.bus, self.operations = agents, bus, operations

    def handle(self, command: MergeNextWorker, context: Context) -> MergeOutcome:
        require_merger(self.agents, context)
        self.operations.check_available(command.worker_id)
        outcome = self.bus.run(MergeWorker(command.worker_id, command.read_important), context.actor, environment_id=context.environment_id)
        if not outcome.conflicts:
            self.bus.run(SendMergerReport(MERGER_MERGED.nudge(worker=command.worker_id)), context.actor, environment_id=context.environment_id)
        return outcome
