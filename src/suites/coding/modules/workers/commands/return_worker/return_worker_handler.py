from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.merger_nudges import MERGER_LINE_AVAILABLE
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merger_nudges import MERGER_PASSED, MERGER_SOURCE
from suites.coding.modules.workers.commands.return_worker.return_worker import ReturnWorker
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.support.merger_visits import MergerVisits


class ReturnWorkerHandler(Handler[ReturnWorker, None]):
    """Leaves the worker to the main agent: the merger no longer lists it."""

    command = ReturnWorker

    def __init__(self, agents: AgentRows, worktrees: WorktreeQuery, repository: Repository, main_line: MainAgentLine, visits: MergerVisits) -> None:
        self.agents, self.worktrees, self.repository, self.main_line, self.visits = agents, worktrees, repository, main_line, visits

    def handle(self, command: ReturnWorker, context: Context) -> None:
        require_merger(self.agents, context)
        self.visits.close_newest(context)
        worktree: Worktree | None = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None:
            raise Refusal(f"worker {command.worker_id} has nothing delivered")
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.return_worker, returned_at=context.timestamp, pass_reason=command.reason), context)
        line = self.repository.save(MergerLine(text=f"worker:{command.worker_id}: {command.reason}", fallback_source=MERGER_SOURCE, read_at=context.timestamp), context)
        self.main_line.send_nudge(MERGER_PASSED.nudge(worker=command.worker_id), MERGER_SOURCE, context)
        self.main_line.send_nudge(MERGER_LINE_AVAILABLE.nudge(line=line.id), MERGER_SOURCE, context)
