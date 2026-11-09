from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.change.moved import Moved
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_nudges import WORKER_TESTS_PASSED
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED


class MergerTestsPassedListener(CommitListener[Moved[Worktree]]):
    name = "workers.merger-tests-passed"
    moves = [WorktreeLifecycle.mark_tests_passed]

    def __init__(self, bus: Bus, settings: SettingValues) -> None:
        self.bus, self.settings = bus, settings

    def handle(self, event: Moved[Worktree], logged: LoggedEvent) -> None:
        if not self.settings.flag(MERGER_ENABLED) or event.row.tests_passed_at is None or event.row.returned_at is not None:
            return
        line = WORKER_TESTS_PASSED.nudge(worker=event.row.session_agent_id)
        self.bus.run(StartMerger(line, event.row.tests_passed_at), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)
