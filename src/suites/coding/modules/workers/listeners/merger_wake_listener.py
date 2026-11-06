from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.change.moved import Moved
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from suites.coding.modules.workers.commands.merger.merger_commands import WakeMerger
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree


class MergerWakeListener(CommitListener[Moved[Worktree]]):
    """Wakes the merger when a worker's tests have passed."""

    name = "workers.merger-wake"
    moves = [WorktreeLifecycle.mark_tests_passed]

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Moved[Worktree], logged: LoggedEvent) -> None:
        if event.row.tests_passed_at is not None:
            self.bus.run(WakeMerger(event.row.session_agent_id), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)
