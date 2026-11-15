from engine.ticker.tick_handler import TickHandler
from core.modules.agents.ticks.program_settings_watch import ProgramSettingsWatch
from engine.ticker.tick_interval import TickInterval


class ProgramSettingsWatchTickHandler(TickHandler):
    """The tick handler of ProgramSettingsWatch."""

    interval = TickInterval(seconds=2)
    handler = ProgramSettingsWatch()
    name = "program settings watch"
    starts_immediately = True
