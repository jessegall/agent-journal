from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.merge_worker.merge_worker import MergeWorker
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.support.merger_nudges import MERGER_JOB, MERGER_MERGED, MERGER_PASSED, MERGER_PROFILE, MERGER_SOURCE, NO_WORKER_WAITING
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report import SendMergerReport
from suites.coding.modules.workers.commands.merge_next_worker.merge_next_worker import MergeNextWorker
from suites.coding.modules.workers.commands.merger.require_merger import require_merger


class MergeNextWorkerHandler(Handler[MergeNextWorker, MergeOutcome]):
    """Merges the worker, and tells the main agent one line."""

    command = MergeNextWorker
    transactional = False

    def __init__(self, agents: AgentRows, bus: Bus) -> None:
        self.agents, self.bus = agents, bus

    def handle(self, command: MergeNextWorker, context: Context) -> MergeOutcome:
        require_merger(self.agents, context)
        outcome = self.bus.run(MergeWorker(command.worker_id), context.actor, environment_id=context.environment_id)
        if not outcome.conflicts:
            self.bus.run(SendMergerReport(MERGER_MERGED.nudge(worker=command.worker_id).text), context.actor, environment_id=context.environment_id)
        return outcome
