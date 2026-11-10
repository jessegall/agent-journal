from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.commands.check_worker_files.check_worker_files import CheckWorkerFiles
from suites.coding.modules.workers.models.worker_refusal_count import WorkerRefusalCount
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.refusal_file_paths import RefusalFilePaths
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers


class CheckWorkerFilesHandler(Handler[CheckWorkerFiles, str]):
    """Prints which refused files are the worker's own and which are not. It changes nothing."""

    command = CheckWorkerFiles
    runs_once = True
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, worktrees: WorktreeQuery, queries: Queries, git: WorktreeGit, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.agents, self.worktrees, self.queries, self.git = agents, worktrees, queries, git

    def handle(self, command: CheckWorkerFiles, context: Context) -> str:
        require_merger(self.agents, context)
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None:
            raise Refusal(f"{AgentLabel.from_row_id(command.worker_id, self.numbers, "worker").text} has no worktree", "journal worker-worktree list shows the worktrees")
        worker_files = set(self.git.worker_files(worktree))
        refused = set(self.refused_files(worktree))
        lines = [self.line("own and refused", worker_files & refused), self.line("refused only", refused - worker_files), self.line("own only", worker_files - refused)]
        return "\n".join([*lines, self.closing_line(refused, refused - worker_files)])

    def refused_files(self, worktree: Worktree) -> tuple[str, ...]:
        counted = self.queries.query(WorkerRefusalCount).filter(worktree_id=worktree.id).first()
        return () if counted is None or counted.refusal_text is None else RefusalFilePaths.paths(counted.refusal_text)

    @staticmethod
    def line(label: str, files: set[str]) -> str:
        return f"{label}: {', '.join(sorted(files)) if files else 'none'}"

    @staticmethod
    def closing_line(refused: set[str], foreign: set[str]) -> str:
        if not refused:
            return "no refused files"
        return f"{len(foreign)} refused files are not yours" if foreign else "all refused files are yours"
