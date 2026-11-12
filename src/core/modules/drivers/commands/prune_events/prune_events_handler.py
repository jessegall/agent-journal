from datetime import timedelta

from engine.event.event_log import EventLog
from engine.command.context import Context
from engine.command.handler import Handler
from engine.model.model import Model
from engine.model.tables import Tables
from engine.registry.registry import Registry
from engine.time.timestamp import Timestamp
from core.modules.drivers.commands.prune_events.prune_events import PruneEvents
from core.modules.drivers.support.driver_settings import EVENT_HOURS_SETTING
from engine.setting.setting_values import SettingValues

WINDOW_IDS = 1000


class PruneEventsHandler(Handler[PruneEvents, int]):
    """Deletes, in the oldest window of event ids, the logged changes of the rows whose model marks them as
    expiring, older than the kept hours and passed by every listener. The changes of every other row stay,
    because their history is read."""

    command = PruneEvents

    def __init__(self, log: EventLog, tables: Tables, registry: Registry, settings: SettingValues) -> None:
        self.log, self.tables, self.registry, self.settings = log, tables, registry, settings

    def handle(self, command: PruneEvents, context: Context) -> int:
        deleted, _ = self.log.prune(self.expiring_tables(), self.cutoff(context.timestamp), self.log.oldest_id() - 1, WINDOW_IDS)
        return deleted

    def expiring_tables(self) -> tuple[str, ...]:
        models = (entry.model.checked_class(Model) for entry in self.registry.models.values())
        return tuple(self.tables.table(model).name for model in models if model.events_expire)

    def cutoff(self, now: Timestamp) -> str:
        return Timestamp(now.value - timedelta(hours=self.settings.project.number(EVENT_HOURS_SETTING))).text
