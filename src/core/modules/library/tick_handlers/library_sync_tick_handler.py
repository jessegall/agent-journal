from engine.ticker.tick_handler import TickHandler
from core.modules.library.ticks.library_sync_tick import LibrarySyncTick
from engine.ticker.tick_interval import TickInterval


class LibrarySyncTickHandler(TickHandler):
    """The tick handler of LibrarySyncTick."""

    interval = TickInterval(seconds=10)
    handler = LibrarySyncTick()
    name = "library sync"
