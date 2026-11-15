from engine.ticker.tick_handler import TickHandler
from suites.coding.modules.workers.ticks.behind_worktrees import BehindWorktrees
from engine.ticker.tick_interval import TickInterval


class BehindWorktreesTickHandler(TickHandler):
    """The tick handler of BehindWorktrees."""

    interval = TickInterval(seconds=60)
    handler = BehindWorktrees()
    name = "behind worktrees"
