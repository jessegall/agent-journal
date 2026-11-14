from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from suites.coding.modules.workers.commands.end_worktree_proofs.end_worktree_proofs import EndWorktreeProofs
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree


class GoneWorktreeProofsListener(CommitListener[Moved[Worktree]]):
    """Ends the queued and running proof tests of a worktree once it is abandoned or removed."""

    name = "workers.gone-worktree-proofs"
    moves = [WorktreeLifecycle.abandon, WorktreeLifecycle.remove]

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Moved[Worktree], logged: LoggedEvent) -> None:
        worktree = event.row
        self.bus.run(EndWorktreeProofs(worktree.id), Actor.core(), cause_id=logged.id, environment_id=worktree.environment_id)
