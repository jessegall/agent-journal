from datetime import timedelta

from engine.change.event_log import EventLog
from engine.command.context import Context
from engine.command.handler import Handler
from engine.model.model import Model
from engine.model.tables import Tables
from engine.registry.registry import Registry
from engine.time.timestamp import Timestamp
from core.modules.drivers.commands.prune_events.prune_events import PruneEvents
from core.modules.drivers.support.driver_settings import EVENT_HOURS_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues

MOST_EVENTS_PRUNED = 5000


class PruneEventsHandler(Handler[PruneEvents, int]):
    """Deletes one batch of the logged changes of the rows whose model marks them as expiring, older than the
    kept hours and passed by every listener. The changes of every other row stay, because their history is
    read."""

    command = PruneEvents

    def __init__(self, log: EventLog, tables: Tables, registry: Registry, settings: SettingValues) -> None:
        self.log, self.tables, self.registry, self.settings = log, tables, registry, settings

    def handle(self, command: PruneEvents, context: Context) -> int:
        cutoff_at = Timestamp(context.timestamp.value - timedelta(hours=self.settings.project.number(EVENT_HOURS_SETTING)))
        models = (entry.model.checked_class(Model) for entry in self.registry.models.values())
        return self.log.prune(tuple(self.tables.table(model).name for model in models if model.events_expire), cutoff_at.text, MOST_EVENTS_PRUNED)
