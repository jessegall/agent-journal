from engine.actor.actor import Actor
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.command.bus import Bus
from engine.listener.commit_listener import CommitListener
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.merge_ready_lines import MergeReadyLines
from suites.coding.modules.workers.support.worktree_runs import WorktreeRuns
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED


class MergeReadyListener(CommitListener[Moved[Worktree]]):
    """Starts the merger when a worktree can be merged: when its tests passed, or, in a started plan, when its
    work was committed for the last time and no worker run of it still goes or failed."""

    name = "workers.merge-ready"
    moves = [WorktreeLifecycle.mark_tests_passed, WorktreeLifecycle.deliver]

    def __init__(self, bus: Bus, settings: SettingValues, lines: MergeReadyLines, runs: WorktreeRuns) -> None:
        self.bus, self.settings, self.lines, self.runs = bus, settings, lines, runs

    def handle(self, event: Moved[Worktree], logged: LoggedEvent) -> None:
        if not self.settings.flag(MERGER_ENABLED) or not event.row.is_merge_ready or self.runs.holds_merge(event.row.id):
            return
        self.bus.run(StartMerger(self.lines.nudge(event.row), event.row.merge_ready_at), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)
