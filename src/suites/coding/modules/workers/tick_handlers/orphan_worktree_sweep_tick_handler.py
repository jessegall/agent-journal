from engine.container.container import Container
from engine.ticker.tick_handler import TickHandler
from engine.ticker.tick_interval import TickInterval
from suites.coding.modules.workers.support.orphan_worktree_sweep import OrphanWorktreeSweep


def sweep_orphan_worktrees(container: Container) -> None:
    container.get(OrphanWorktreeSweep).sweep()


class OrphanWorktreeSweepTickHandler(TickHandler):
    """Every hour, the worktrees no worker holds are swept away."""

    interval = TickInterval(seconds=3600)
    handler = sweep_orphan_worktrees
    name = "orphan worktree sweep"
