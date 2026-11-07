from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merger_nudges import MERGER_JOB, MERGER_PASSED, MERGER_PROFILE, MERGER_SOURCE, NO_WORKER_WAITING
from suites.coding.modules.workers.commands.return_worker.return_worker import ReturnWorker
from suites.coding.modules.workers.commands.merger.require_merger import require_merger


class ReturnWorkerHandler(Handler[ReturnWorker, None]):
    """Leaves the worker to the main agent: the merger no longer lists it."""

    command = ReturnWorker

    def __init__(self, agents: AgentRows, worktrees: WorktreeQuery, repository: Repository, main_line: MainAgentLine) -> None:
        self.agents, self.worktrees, self.repository, self.main_line = agents, worktrees, repository, main_line

    def handle(self, command: ReturnWorker, context: Context) -> None:
        require_merger(self.agents, context)
        worktree: Worktree | None = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None:
            raise Refusal(f"worker {command.worker_id} has nothing delivered")
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.mark_tests_passed, left_to_main_at=context.timestamp), context)
        self.main_line.send(MERGER_PASSED.nudge(worker=command.worker_id, reason=command.reason).text, MERGER_SOURCE, context)
