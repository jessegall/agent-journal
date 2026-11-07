from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.change.created import Created
from core.base.change.moved import Moved
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_nudges import WORKER_TESTS_PASSED


class MergerWakeListener(CommitListener[Moved[Worktree] | Created[MergerLine]]):
    """Wakes the merger when a worker's tests have passed or a line waits for it."""

    name = "workers.merger-wake"
    moves = [WorktreeLifecycle.mark_tests_passed]

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Moved[Worktree] | Created[MergerLine], logged: LoggedEvent) -> None:
        if isinstance(event.row, MergerLine):
            self.bus.run(StartMerger(event.row.text), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)
        elif event.row.tests_passed_at is not None and event.row.left_to_main_at is None:
            line = WORKER_TESTS_PASSED.nudge(worker=event.row.session_agent_id).text
            self.bus.run(StartMerger(line), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)
