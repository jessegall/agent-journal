from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.merge_worker.merge_worker import MergeWorker
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.commands.merge_next_worker.merge_next_worker import MergeNextWorker
from suites.coding.modules.workers.commands.merger.require_merger import require_merger


class MergeNextWorkerHandler(Handler[MergeNextWorker, MergeOutcome]):
    """Merges a worker after the merger reviews its logs."""

    command = MergeNextWorker
    transactional = False

    def __init__(self, agents: AgentRows, bus: Bus) -> None:
        self.agents, self.bus = agents, bus

    def handle(self, command: MergeNextWorker, context: Context) -> MergeOutcome:
        require_merger(self.agents, context)
        return self.bus.run(MergeWorker(command.worker_id, command.read_important), context.actor, environment_id=context.environment_id)
