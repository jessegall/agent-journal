from engine.container.container import Container
from engine.database.database import Database
from engine.event.event_log import EventLog
from engine.setting.setting_values import SettingValues
from core.modules.drivers.commands.prune_events.prune_events_handler import WINDOW_IDS, PruneEventsHandler

FREED_PAGES = 200


class EventPruning:
    """Every few seconds one small window of the oldest event ids past the kept newest is deleted in a short write
    of its own, going on from where the last window ended, and the freed pages are given back."""

    def __init__(self) -> None:
        self.after_id: int | None = None

    def __call__(self, container: Container) -> None:
        log = container.get(EventLog)
        if self.after_id is None:
            self.after_id = log.oldest_id() - 1
        with container.get(Database).transaction():
            _, self.after_id = log.prune(PruneEventsHandler(log, container.get(SettingValues)).kept(), self.after_id, WINDOW_IDS)
        container.get(Database).release_free_pages(FREED_PAGES)
