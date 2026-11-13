from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.commands.report_merge_hook.report_merge_hook import ReportMergeHook
from suites.coding.modules.workers.support.worktree_commands import WorktreeCommands
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.merge_followup import STEP_FINISHED
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.merge_hooks import MergeHooks


class MergeHooksListener(CommitListener[Moved[Worktree]]):
    """After a worker is merged, runs the merge hooks of its profile in the checkout it was merged into, each as a
    process of its own after the merge committed, so whatever a hook writes is its own change. A hook that fails
    is told to the main agent; the merge stands."""

    name = "workers.merge-hooks"
    moves = [WorktreeLifecycle.merge]

    def __init__(self, bus: Bus, queries: Queries, hooks: MergeHooks, commands: WorktreeCommands) -> None:
        self.bus, self.queries, self.hooks, self.commands = bus, queries, hooks, commands

    def handle(self, event: Moved[Worktree], logged: LoggedEvent) -> None:
        worktree = event.row
        lines = self.hooks.commands(self.queries.query(Agent).find(worktree.session_agent_id).profile)
        if not lines:
            return
        folder = self.queries.query(Environment).find(worktree.environment_id).folder
        for line in lines:
            outcome = self.commands.merge_hook(folder, worktree, line)
            if outcome.state != STEP_FINISHED:
                self.bus.run(ReportMergeHook(worktree.session_agent_id, line), Actor.core(), cause_id=logged.id,
                             environment_id=worktree.environment_id)
