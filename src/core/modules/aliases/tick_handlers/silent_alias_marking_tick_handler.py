from engine.ticker.tick_handler import TickHandler
from core.modules.aliases.ticks.silent_alias_marking import SilentAliasMarking
from engine.ticker.tick_interval import TickInterval


class SilentAliasMarkingTickHandler(TickHandler):
    """The tick handler of SilentAliasMarking."""

    interval = TickInterval(seconds=1)
    handler = SilentAliasMarking()
    name = "silent aliases"
