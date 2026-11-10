from engine.actor.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.change.moved import Moved
from engine.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from suites.coding.modules.workers.commands.send_merged_worker_line.send_merged_worker_line import SendMergedWorkerLine
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree


class MergedWorkerLineListener(CommitListener[Moved[Worktree]]):
    """Whoever merged a worker's work, the main agent hears of it and an idle one is woken."""

    name = "workers.merged-worker-line"
    moves = [WorktreeLifecycle.merge]

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Moved[Worktree], logged: LoggedEvent) -> None:
        self.bus.run(SendMergedWorkerLine(event.row.session_agent_id), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)
