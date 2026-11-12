from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from engine.query.queries import Queries
from engine.setting.setting_values import SettingValues
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.checkpoint_reach_source import CheckpointReachSource
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from core.modules.plans.models.lifecycles.checkpoint_lifecycle import CheckpointLifecycle
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.commands.start_worker_runs.start_worker_runs import StartWorkerRuns
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_reach import WorktreeReach
from suites.coding.modules.workers.support.merge_ready_lines import MergeReadyLines
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.modules.workers.support.worktree_runs import WorktreeRuns
from suites.coding.modules.workers.commands.wake_waiting_worker.wake_waiting_worker import WakeWaitingWorker


class WorkerRunEndListener(CommitListener[Moved[CheckpointReach]]):
    """When a worker run ends, the worker's newest commit gets the runs that waited for it, and a delivered
    worktree whose runs all passed goes to the merger. A worker that waits with its whole unit committed is
    woken by a pass with its next step; a worker still at work hears nothing."""

    name = "workers.worker-run-end"
    moves = [CheckpointLifecycle.passed, CheckpointLifecycle.failed]

    def __init__(self, bus: Bus, queries: Queries, settings: SettingValues, lines: MergeReadyLines, runs: WorktreeRuns) -> None:
        self.bus, self.queries, self.settings, self.lines, self.runs = bus, queries, settings, lines, runs

    def handle(self, event: Moved[CheckpointReach], logged: LoggedEvent) -> None:
        if event.row.source is not CheckpointReachSource.AGENT_COMMIT:
            return
        link = self.queries.query(WorktreeReach).filter(reach_id=event.row.id).first()
        if link is None:
            return
        worktree = self.queries.query(Worktree).find(link.worktree_id)
        if worktree.state is WorktreeState.MERGED:
            return
        self.bus.run(StartWorkerRuns(worktree.id, worktree.commit_short_id), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)
        if event.row.state is CheckpointState.PASSED:
            self.bus.run(WakeWaitingWorker(worktree.session_agent_id, event.row.phase_id), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)
        if event.row.state is CheckpointState.PASSED and self.starts_merger(worktree):
            self.bus.run(StartMerger(self.lines.nudge(worktree), worktree.merge_ready_at), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)

    def starts_merger(self, worktree: Worktree) -> bool:
        return worktree.is_merge_ready and self.settings.flag(MERGER_ENABLED) and not self.runs.holds_merge(worktree.id)
