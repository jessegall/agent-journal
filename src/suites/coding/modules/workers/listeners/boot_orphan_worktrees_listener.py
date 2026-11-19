from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from engine.event.journal_booting import JournalBooting
from suites.coding.modules.workers.support.orphan_worktree_sweep import OrphanWorktreeSweep


class BootOrphanWorktreesListener(CommitListener[JournalBooting]):
    """As the journal starts, the worktrees no worker holds are swept away in every environment that is a
    repository, ahead of the listeners that publish skills into worktrees, whose files would make them look
    changed."""

    name = "workers.boot-worktree-sweep"
    run_order = -1

    def __init__(self, sweep: OrphanWorktreeSweep) -> None:
        self.sweep = sweep

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        self.sweep.sweep()
