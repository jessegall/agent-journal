from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.merge_worker.merge_worker import MergeWorker
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.commands.merge_next_worker.merge_next_worker import MergeNextWorker
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.queries.worker_operation_query import WorkerOperationQuery
from suites.coding.modules.workers.support.merger_visits import MergerVisits


class MergeNextWorkerHandler(Handler[MergeNextWorker, MergeOutcome]):
    """Merges a worker after the merger reviews its logs."""

    command = MergeNextWorker

    def __init__(self, agents: AgentRows, bus: Bus, operations: WorkerOperationQuery, visits: MergerVisits) -> None:
        self.agents, self.bus, self.operations, self.visits = agents, bus, operations, visits

    def handle(self, command: MergeNextWorker, context: Context) -> MergeOutcome:
        require_merger(self.agents, context)
        self.visits.close_newest(context)
        self.operations.check_available(command.worker_id)
        return self.bus.dispatch(MergeWorker(command.worker_id, command.read_important), context)
