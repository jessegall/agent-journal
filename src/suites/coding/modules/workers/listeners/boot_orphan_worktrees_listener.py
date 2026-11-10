from engine.actor.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from engine.errors.refusal import Refusal
from core.modules.environments.support.environment_rows import EnvironmentRows
from suites.coding.modules.workers.commands.remove_orphan_worktrees.remove_orphan_worktrees import RemoveOrphanWorktrees
from core.base.change.journal_booting import JournalBooting


class BootOrphanWorktreesListener(CommitListener[JournalBooting]):
    """As the journal starts, the worktrees no worker holds are swept away in every environment that is a
    repository, ahead of the listeners that publish skills into worktrees, whose files would make them look
    changed."""

    name = "workers.boot-worktree-sweep"
    run_order = -1

    def __init__(self, environments: EnvironmentRows, bus: Bus) -> None:
        self.environments, self.bus = environments, bus

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        for environment in self.environments.all():
            try:
                self.bus.run(RemoveOrphanWorktrees(), Actor.core(), environment_id=environment.id)
            except Refusal:
                continue
