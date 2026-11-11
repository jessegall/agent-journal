from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit_listener import CommitListener
from engine.query.queries import Queries
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.checkpoint_reach_source import CheckpointReachSource
from core.modules.plans.models.lifecycles.checkpoint_lifecycle import CheckpointLifecycle
from suites.coding.modules.workers.commands.start_worker_runs.start_worker_runs import StartWorkerRuns
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_reach import WorktreeReach


class QueuedWorkerRunListener(CommitListener[Moved[CheckpointReach]]):
    """When a worker run ends, the worker's newest commit gets the runs that waited for it."""

    name = "workers.queued-worker-run"
    moves = [CheckpointLifecycle.passed, CheckpointLifecycle.failed]

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: Moved[CheckpointReach], logged: LoggedEvent) -> None:
        if event.row.source is not CheckpointReachSource.WORKER:
            return
        link = self.queries.query(WorktreeReach).filter(reach_id=event.row.id).first()
        if link is None:
            return
        worktree = self.queries.query(Worktree).find(link.worktree_id)
        if worktree.state is WorktreeState.MERGED:
            return
        self.bus.run(StartWorkerRuns(worktree.id, worktree.commit_short_id), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)
