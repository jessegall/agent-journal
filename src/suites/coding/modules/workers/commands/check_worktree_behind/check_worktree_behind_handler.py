from engine.actor.actor import Actor
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.check_worktree_behind.check_worktree_behind import CheckWorktreeBehind
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.support.behind_checks import BehindChecks
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class CheckWorktreeBehindHandler(Handler[CheckWorktreeBehind, bool]):
    """Counts the worktree's commits behind its base once, before the transaction opens, since git runs, and opens a
    check with the base tip and the count when the worktree is far enough behind; answers whether it opened one."""

    command = CheckWorktreeBehind
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, git: WorktreeGit, checks: BehindChecks, repository: Repository) -> None:
        self.rows, self.git, self.checks, self.repository = rows, git, checks, repository
        self.behind, self.tip = 0, ""

    def prepare(self, command: CheckWorktreeBehind, actor: Actor) -> None:
        worktree = self.rows.required(Worktree, command.worktree_id)
        self.tip = self.git.tip(worktree.folder, worktree.base_branch)
        self.behind = self.git.behind(worktree)

    def handle(self, command: CheckWorktreeBehind, context: Context) -> bool:
        worktree = self.rows.required(Worktree, command.worktree_id)
        if not self.checks.opens(worktree, self.behind):
            return False
        self.repository.save(WorktreeBehindCheck.opened(worktree.environment_id, worktree.id, self.tip, self.behind), context)
        return True
