from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from engine.event.journal_booting import JournalBooting
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from engine.query.queries import Queries
from suites.coding.modules.workers.commands.release_worker.release_worker import ReleaseWorker
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree

INTERRUPTED_REASON = "every worktree a restart left new is undone as the journal starts"


class BootInterruptedCutsListener(CommitListener[JournalBooting]):
    """As the journal starts, a worktree a restart left new, never recorded as cut, is undone: its folder is removed
    and its worker's opening cancelled, so its task is still open and can be dispatched again."""

    name = "workers.boot-interrupted-cuts"
    run_order = -1

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        for worktree in tuple(self.queries.query(Worktree).filter(state=WorktreeState.NEW).every_row(INTERRUPTED_REASON)):
            try:
                self.bus.run(ReleaseWorker(worktree.session_agent_id, "the journal restarted while its worktree was cut"), Actor.core(), environment_id=worktree.environment_id)
            except Refusal:
                continue
