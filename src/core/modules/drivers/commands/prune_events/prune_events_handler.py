from engine.event.event_log import EventLog
from engine.command.context import Context
from engine.command.handler import Handler
from engine.setting.setting_values import SettingValues
from core.modules.drivers.commands.prune_events.prune_events import PruneEvents
from core.modules.drivers.support.driver_settings import EVENT_COUNT_SETTING
from engine.database.prune_window import PruneWindow

WINDOW_IDS = 1000


class PruneEventsHandler(Handler[PruneEvents, int]):
    """Deletes, in the oldest window of event ids, the logged changes older than the newest the setting keeps and
    already passed by every listener: the event log is a rolling log of the newest changes."""

    command = PruneEvents

    def __init__(self, log: EventLog, settings: SettingValues) -> None:
        self.log, self.settings = log, settings

    def handle(self, command: PruneEvents, context: Context) -> int:
        deleted, _ = self.log.prune(PruneWindow(self.kept(), self.log.oldest_id() - 1, WINDOW_IDS))
        return deleted

    def kept(self) -> int:
        return self.settings.project.number(EVENT_COUNT_SETTING)
