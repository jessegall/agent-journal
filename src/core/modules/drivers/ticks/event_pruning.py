from engine.container.container import Container
from engine.database.database import Database
from engine.event.event_log import EventLog
from engine.model.tables import Tables
from engine.registry.registry import Registry
from engine.setting.setting_values import SettingValues
from engine.time.clock import Clock
from core.modules.drivers.commands.prune_events.prune_events_handler import WINDOW_IDS, PruneEventsHandler


class EventPruning:
    """Every few seconds one small window of event ids is pruned in a short write of its own, going on from where
    the last window ended, so no prune ever walks the whole event log or holds the write lock for long."""

    def __init__(self) -> None:
        self.after_id: int | None = None

    def __call__(self, container: Container) -> None:
        log = container.get(EventLog)
        handler = PruneEventsHandler(log, container.get(Tables), container.get(Registry), container.get(SettingValues))
        if self.after_id is None:
            self.after_id = log.oldest_id() - 1
        with container.get(Database).transaction():
            _, self.after_id = log.prune(handler.expiring_tables(), handler.cutoff(container.get(Clock).timestamp()), self.after_id, WINDOW_IDS)
