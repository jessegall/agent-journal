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
from engine.query.queries import Queries
from engine.repository.repository import Repository
from suites.coding.modules.workers.commands.merge_finished_tasks.merge_finished_tasks import MergeFinishedTasks
from suites.coding.modules.workers.models.enums.merge_ask_state import MergeAskState
from suites.coding.modules.workers.models.lifecycles.merge_ask_lifecycle import MergeAskLifecycle
from suites.coding.modules.workers.models.merge_ask import MergeAsk
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class MergeNextWorkerHandler(Handler[MergeNextWorker, MergeOutcome]):
    """Merges a worker after the merger reviews its logs: its whole worktree, or the part up to the last task its
    waiting ask named, read by task id at the merge so a rebase since the ask changes nothing."""

    command = MergeNextWorker

    def __init__(self, agents: AgentRows, bus: Bus, operations: WorkerOperationQuery, visits: MergerVisits, queries: Queries, repository: Repository, worktrees: WorktreeQuery) -> None:
        self.agents, self.bus, self.operations, self.visits = agents, bus, operations, visits
        self.queries, self.repository, self.worktrees = queries, repository, worktrees

    def handle(self, command: MergeNextWorker, context: Context) -> MergeOutcome:
        require_merger(self.agents, context)
        self.visits.close_newest(context)
        self.operations.check_available(command.worker_id)
        part_ask = self.part_ask(command.worker_id)
        if part_ask is None:
            return self.bus.dispatch(MergeWorker(command.worker_id, command.read_important), context)
        outcome = self.bus.dispatch(MergeFinishedTasks(command.worker_id, str(part_ask.tasks()[-1])), context)
        self.repository.save_change(part_ask, part_ask.moved(MergeAskLifecycle.merge), context)
        return outcome

    def part_ask(self, worker_id: int) -> MergeAsk | None:
        worktree = self.worktrees.worker_worktree(worker_id)
        if worktree is None:
            return None
        return self.queries.query(MergeAsk).filter(worktree_id=worktree.id, state=MergeAskState.WAITING, is_whole=False).first()
