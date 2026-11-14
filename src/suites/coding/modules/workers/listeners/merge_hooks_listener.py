from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from engine.listener.commit.commit_listener_runner import PROGRAM_STOP_RUN_ORDER
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.support.merge_hook_starts import MergeHookStarts
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.merge_hooks import MergeHooks


class MergeHooksListener(CommitListener[Moved[Worktree]]):
    """After a worker is merged, runs the merge hooks of its profile in the checkout it was merged into, each as
    a process of its own after the merge committed, so whatever a hook writes is its own change. The hooks are
    started and the listener returns; MergeHookEndListener tells the main agent of one that fails."""

    name = "workers.merge-hooks"
    moves = [WorktreeLifecycle.merge]
    run_order = PROGRAM_STOP_RUN_ORDER

    def __init__(self, queries: Queries, hooks: MergeHooks, starts: MergeHookStarts) -> None:
        self.queries, self.hooks, self.starts = queries, hooks, starts

    def handle(self, event: Moved[Worktree], logged: LoggedEvent) -> None:
        worktree = event.row
        lines = self.hooks.commands(self.queries.query(Agent).find(worktree.session_agent_id).profile)
        if not lines:
            return
        folder = self.queries.query(Environment).find(worktree.environment_id).folder
        for line in lines:
            self.starts.start(folder, worktree, line, logged.id)
